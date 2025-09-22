import random
import time
import copy
import threading
from typing import Dict, List, Tuple, Optional

import http.client

conn = http.client.HTTPSConnection("railradar.in")

headers = { 'x-api-key': "rr_live_EXPo2kM5HHtFeQiGlZm6w4FhBJHmlaYj" }

conn.request("GET", "/api/v1/trains/live-map", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))

# ----------------------------
# Config: GA & runtime params
# ----------------------------
RANDOM_SEED = 42
POP_SIZE = 60
GENERATIONS = 50
MUTATION_RATE = 0.25
ELITISM_RATIO = 0.15    # top X fraction kept each generation
POLL_INTERVAL = 6       # seconds between checking for live updates in demo (adjust in real system)
WARM_START_ON_UPDATE = True

random.seed(RANDOM_SEED)

# ----------------------------
# Priority weights & headway
# ----------------------------
PRIORITY_WEIGHTS = {"express": 3, "passenger": 2, "freight": 1}
# Minimum headway (minutes) required between two trains on the same platform when scheduled back-to-back
MIN_HEADWAY = 1

# ----------------------------
# Data model
# Each train: id, type (express/passenger/freight), arrival(mins), cross_time(mins), platform (optional)
# Example: {"id":"T1","type":"express","arrival":600,"cross_time":4,"platform":1}
# ----------------------------



# ----------------------------
# Fitness function: models platforms, maintenance, headways, priorities
# Lower is better (total weighted delay + heavy penalties)
# ----------------------------
def evaluate_schedule(schedule: List[str], trains: Dict[str, dict],
                      maintenance_windows: List[Tuple[int, int]] = None) -> float:
    """
    schedule: list of train IDs in the order we let them occupy their platform (not per-platform assignment)
    trains: mapping id -> train data (arrival, cross_time, platform if fixed)
    maintenance_windows: list of (start_min, end_min) intervals during which platform is blocked
    Returns a scalar score: lower is better
    """
    maintenance_windows = maintenance_windows or []
    platform_free_at = {}   # platform -> time minute when it becomes free
    total_weighted_delay = 0
    penalty = 0

    for tid in schedule:
        t = trains[tid]
        plat = t.get("platform", 1)  # default platform 1 if not specified
        arrival = int(t["arrival"])
        cross = int(t["cross_time"])
        typ = t.get("type", "passenger")
        weight = PRIORITY_WEIGHTS.get(typ, 2)

        free_at = platform_free_at.get(plat, 0)
        # Respect minimum headway: next train can only start at free_at + MIN_HEADWAY
        start = max(free_at + MIN_HEADWAY, arrival)

        # Maintenance conflict penalty: heavy penalty if any part of train occupation overlaps maintenance window
        for (m_start, m_end) in maintenance_windows:
            # overlap if start < m_end and (start+cross) > m_start
            if start < m_end and (start + cross) > m_start:
                penalty += 1000  # huge penalty (effectively disallows)
        # Delay computed as waiting beyond arrival
        delay = max(0, start - arrival)
        total_weighted_delay += delay * weight

        # Update platform free time
        platform_free_at[plat] = start + cross

        # Safety check: if start < arrival (shouldn't happen) penalize
        if start < arrival:
            penalty += 500

    # Also penalize overlapping trains on same platform in schedule order (double-check)
    # This is mostly redundant due to start calculation, but keep as guard.
    # Lower score is better
    score = total_weighted_delay + penalty
    return score


# ----------------------------
# GA: permutation-based
# Supports warm-start via init_pop (list of permutations)
# ----------------------------
def create_random_individual(trains: Dict[str, dict]) -> List[str]:
    ids = list(trains.keys())
    random.shuffle(ids)
    return ids


def order_crossover(p1: List[str], p2: List[str]) -> List[str]:
    size = len(p1)
    a, b = sorted(random.sample(range(size), 2))
    child = [None] * size
    # copy slice from p1
    child[a:b+1] = p1[a:b+1]
    # fill remaining from p2 in order
    idx = 0
    for gene in p2:
        if gene in child:
            continue
        while child[idx] is not None:
            idx += 1
        child[idx] = gene
    return child


def swap_mutation(ind: List[str]) -> None:
    i, j = random.sample(range(len(ind)), 2)
    ind[i], ind[j] = ind[j], ind[i]


def tournament_selection(pop: List[List[str]], scores: List[float], k=3) -> List[str]:
    # pick k random individuals, return best
    idxs = random.sample(range(len(pop)), min(k, len(pop)))
    best = min(idxs, key=lambda i: scores[i])
    return pop[best]


def run_ga(trains: Dict[str, dict],
           maintenance_windows: List[Tuple[int, int]] = None,
           generations: int = GENERATIONS,
           pop_size: int = POP_SIZE,
           mutation_rate: float = MUTATION_RATE,
           init_pop: Optional[List[List[str]]] = None) -> List[List[str]]:
    # initialize population
    if init_pop:
        population = init_pop[:]  # copy
        while len(population) < pop_size:
            population.append(create_random_individual(trains))
    else:
        population = [create_random_individual(trains) for _ in range(pop_size)]

    for gen in range(generations):
        # evaluate
        scores = [evaluate_schedule(ind, trains, maintenance_windows) for ind in population]
        # sort by score ascending (lower better)
        paired = sorted(zip(scores, population), key=lambda x: x[0])
        population = [p for (_, p) in paired]

        # log best occasionally
        if gen % max(1, generations // 10) == 0:
            print(f"[GA] gen {gen+1}/{generations} best score = {paired[0][0]}")

        # elitism: keep top E
        E = max(1, int(pop_size * ELITISM_RATIO))
        new_pop = population[:E]

        # fill rest
        while len(new_pop) < pop_size:
            # selection
            parent1 = tournament_selection(population, [evaluate_schedule(p, trains, maintenance_windows) for p in population])
            parent2 = tournament_selection(population, [evaluate_schedule(p, trains, maintenance_windows) for p in population])
            child = order_crossover(parent1, parent2)
            if random.random() < mutation_rate:
                swap_mutation(child)
            new_pop.append(child)
        population = new_pop

    # final sort and return population (best first)
    final_scores = [evaluate_schedule(ind, trains, maintenance_windows) for ind in population]
    paired = sorted(zip(final_scores, population), key=lambda x: x[0])
    return [p for (_, p) in paired]


# ----------------------------
# Pretty print an evaluated schedule
# ----------------------------
def print_schedule(schedule: List[str], trains: Dict[str, dict], maintenance_windows=None):
    maintenance_windows = maintenance_windows or []
    platform_free_at = {}
    total_weighted_delay = 0
    print("=" * 72)
    print("Train | type      | arr  | start | end  | delay | w_delay | platform")
    print("-" * 72)
    for tid in schedule:
        t = trains[tid]
        plat = t.get("platform", 1)
        arrival = int(t["arrival"])
        cross = int(t["cross_time"])
        typ = t.get("type", "passenger")
        weight = PRIORITY_WEIGHTS.get(typ, 2)
        free_at = platform_free_at.get(plat, 0)
        start = max(free_at + MIN_HEADWAY, arrival)
        end = start + cross
        delay = max(0, start - arrival)
        wdelay = delay * weight
        total_weighted_delay += wdelay
        platform_free_at[plat] = end
        print(f"{tid:5} | {typ:9} | {arrival:4} | {start:5} | {end:4} | {delay:5} | {wdelay:7} | {plat}")
    print("-" * 72)
    print("Total weighted delay:", total_weighted_delay)
    print("=" * 72)


# ----------------------------
# Main pipeline: initial optimize + background poll thread for live updates
# ----------------------------
class SchedulerService:
    def __init__(self, trains: Dict[str, dict], maintenance_windows=None, live_adapter: LiveAdapter = None):
        self.trains = trains
        self.maintenance_windows = maintenance_windows or []
        self.live_adapter = live_adapter or MockLiveAdapter()
        self.latest_population = None
        self.lock = threading.Lock()
        self._running = False

    def initial_optimize(self):
        print("[Service] Running initial optimization...")
        pop = run_ga(self.trains, self.maintenance_windows, generations=GENERATIONS, pop_size=POP_SIZE)
        with self.lock:
            self.latest_population = pop
        best = pop[0]
        print("[Service] Initial best schedule (score {:.1f}):".format(evaluate_schedule(best, self.trains, self.maintenance_windows)))
        print_schedule(best, self.trains, self.maintenance_windows)

    def poll_live_updates(self, poll_interval=POLL_INTERVAL):
        self._running = True
        print("[Service] Started live polling (interval {}s)".format(poll_interval))
        while self._running:
            updates = self.live_adapter.fetch_live_updates(self.trains)
            if updates:
                print("[Service] Received live updates:", updates)
                apply_live_updates(self.trains, updates)
                # reoptimize quickly with warm start
                with self.lock:
                    init_pop = self.latest_population if WARM_START_ON_UPDATE else None
                pop = run_ga(self.trains, self.maintenance_windows, generations=max(6, GENERATIONS // 5),
                             pop_size=POP_SIZE, init_pop=init_pop)
                with self.lock:
                    self.latest_population = pop
                best = pop[0]
                print("[Service] Re-optimized best schedule (score {:.1f}):".format(evaluate_schedule(best, self.trains, self.maintenance_windows)))
                print_schedule(best, self.trains, self.maintenance_windows)
            time.sleep(poll_interval)

    def start_background_polling(self, poll_interval=POLL_INTERVAL):
        t = threading.Thread(target=self.poll_live_updates, args=(poll_interval,), daemon=True)
        t.start()
        return t

    def stop(self):
        self._running = False


# ----------------------------
# Example: combined scenario construction
# ----------------------------
def build_combined_scenario() -> Tuple[Dict[str, dict], List[Tuple[int,int]], LiveAdapter]:
    """
    Builds a combined scenario that includes:
    - multiple trains close in time (peak conflict)
    - priorities mixed (express/passenger/freight)
    - maintenance window
    - later a real-time delay will be injected via MockLiveAdapter
    """
    trains = {
        "T1": {"id":"T1","type":"express",   "arrival": 600, "cross_time": 4, "platform": 1},
        "T2": {"id":"T2","type":"express",   "arrival": 601, "cross_time": 4, "platform": 1},
        "T3": {"id":"T3","type":"passenger", "arrival": 602, "cross_time": 3, "platform": 1},
        "T4": {"id":"T4","type":"freight",   "arrival": 603, "cross_time": 5, "platform": 1},
        "T5": {"id":"T5","type":"passenger", "arrival": 604, "cross_time": 2, "platform": 1},
        # add scenario 0 small sample inside same set
        "T6": {"id":"T6","type":"passenger", "arrival": 599, "cross_time": 3, "platform": 1},
    }

    # Maintenance window that blocks platform 1 between these minutes
    maintenance_windows = [(606, 610)]  # e.g., 10:06 to 10:10

    # Mock live adapter will delay T2 by +10 minutes at 8 seconds into run,
    # and delay T4 by +6 minutes at 16 seconds. (demo)
    mods = [
        (8, "T2", {"delay": 10}),
        (16, "T4", {"delay": 6}),
    ]
    live_adapter = MockLiveAdapter(mods)
    return trains, maintenance_windows, live_adapter


# ----------------------------
# Entry point
# ----------------------------
def main_demo():
    trains, maintenance_windows, live_adapter = build_combined_scenario()
    svc = SchedulerService(trains, maintenance_windows, live_adapter=live_adapter)
    svc.initial_optimize()
    # Start background polling so whenever mock updates fire, service will reoptimize
    poll_thread = svc.start_background_polling(poll_interval=4)

    # Run demo for some seconds to allow mock updates to trigger
    try:
        demo_runtime = 30
        print(f"[Demo] running for {demo_runtime}s to allow live updates...")
        time.sleep(demo_runtime)
    finally:
        svc.stop()
        print("[Demo] finished.")


if __name__ == "__main__":
    main_demo()

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, MapPin, Train as TrainIcon } from "lucide-react";

interface Train {
  trainNo: string;
  trainName: string;
  trainType: "Superfast" | "Express" | "Goods";
  arrivalTime: string;
  departureTime: string;
  platformNo: number;
}

const trainData: Train[] = [
  {
    trainNo: "",
    trainName: "",
    trainType: "",
    arrivalTime: "",
    departureTime: "",
    platformNo:
  },
  {
    trainNo: "",
    trainName: "",
    trainType: "",
    arrivalTime: "",
    departureTime: "",
    platformNo:
  },
  {
    trainNo: "",
    trainName: "",
    trainType: "",
    arrivalTime: "",
    departureTime: "",
    platformNo: 5,
  },
  {
    trainNo: "",
    trainName: "",
    trainType: "",
    arrivalTime: "",
    departureTime: "",
    platformNo: 
  },
  {
    trainNo: "",
    trainName: "",
    trainType: "",
    arrivalTime: "",
    departureTime: "",
    platformNo: 
  },
];

const TrainSchedule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTrains, setFilteredTrains] = useState(trainData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = trainData.filter(
      (train) =>
        train.trainName.toLowerCase().includes(value.toLowerCase()) ||
        train.trainNo.includes(value) ||
        train.trainType.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTrains(filtered);
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Superfast":
        return "default";
      case "Express":
        return "secondary";
      case "Goods":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <TrainIcon className="h-8 w-8 text-blue-accent" />
          <h1 className="text-3xl font-bold text-foreground">Train Schedule</h1>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Current Time: {getCurrentTime()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>New Delhi Railway Station</span>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Trains</CardTitle>
          <CardDescription>
            Find trains by number, name, or type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by train number, name, or type..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleSearch("")}
              disabled={!searchTerm}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Train Schedule</CardTitle>
          <CardDescription>
            Real-time train arrival and departure information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Train No.</TableHead>
                  <TableHead className="min-w-[200px]">Train Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Platform</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrains.length > 0 ? (
                  filteredTrains.map((train) => (
                    <TableRow key={train.trainNo} className="hover:bg-surface-elevated transition-colors">
                      <TableCell className="font-mono font-medium">
                        {train.trainNo}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {train.trainName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeVariant(train.trainType)}>
                          {train.trainType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {train.arrivalTime}
                      </TableCell>
                      <TableCell className="font-mono">
                        {train.departureTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-accent text-white rounded-full text-sm font-bold">
                          {train.platformNo}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No trains found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-accent rounded-full"></div>
              <span className="text-sm font-medium">Superfast Trains</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {trainData.filter(t => t.trainType === "Superfast").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-sm font-medium">Express Trains</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {trainData.filter(t => t.trainType === "Express").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted rounded-full"></div>
              <span className="text-sm font-medium">Goods Trains</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {trainData.filter(t => t.trainType === "Goods").length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainSchedule;

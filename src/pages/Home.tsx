import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, Clock, MapPin, Shield, Users, CheckCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Train className="h-16 w-16 text-blue-accent" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              RailSchedule
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted companion for accurate, real-time train schedule information. 
              Never miss a train again with our comprehensive railway timetable system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/schedule">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose RailSchedule?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the most reliable and user-friendly train schedule platform in India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-accent mx-auto mb-4" />
                <CardTitle>Real-Time Updates</CardTitle>
                <CardDescription>
                  Get live train schedules with accurate arrival and departure times
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-accent mx-auto mb-4" />
                <CardTitle>Multiple Stations</CardTitle>
                <CardDescription>
                  Access schedules for all major railway stations across India
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-accent mx-auto mb-4" />
                <CardTitle>Reliable Data</CardTitle>
                <CardDescription>
                  Official railway data ensures accuracy and trustworthiness
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-accent mx-auto mb-4" />
                <CardTitle>User Friendly</CardTitle>
                <CardDescription>
                  Simple, intuitive interface designed for all age groups
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Train className="h-12 w-12 text-blue-accent mx-auto mb-4" />
                <CardTitle>All Train Types</CardTitle>
                <CardDescription>
                  Superfast, Express, Local, and Goods train information
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-accent mx-auto mb-4" />
                <CardTitle>Always Updated</CardTitle>
                <CardDescription>
                  Schedule changes and cancellations updated instantly
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-surface-elevated border-border">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of travelers who rely on RailSchedule for their daily commute 
                and long-distance journeys. Sign up now for free access.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-blue-accent mb-2">1000+</h3>
              <p className="text-muted-foreground">Railway Stations</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-accent mb-2">50K+</h3>
              <p className="text-muted-foreground">Daily Users</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-accent mb-2">99.9%</h3>
              <p className="text-muted-foreground">Uptime</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-accent mb-2">24/7</h3>
              <p className="text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import { Train, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface-elevated border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Train className="h-6 w-6 text-blue-accent" />
              <span className="text-lg font-bold text-foreground">RailSchedule</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for accurate and up-to-date train schedule information.
            </p>
          </div>
          
          <div>
            <h3 className="text-foreground font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@railschedule.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-blue-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-blue-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-blue-accent transition-colors">
                Help & Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 RailSchedule. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
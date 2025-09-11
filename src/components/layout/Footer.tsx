import { BarChart3, ArrowRight, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-data-primary/5 via-transparent to-data-accent/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-data-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-data-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-6 md:col-span-1">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-story-gradient rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-story-gradient bg-clip-text text-transparent">
                  Narraviz
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                Transform your data into compelling visual stories with
                AI-powered insights and professional visualizations that drive business impact.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-data-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-data-primary/30 transition-all duration-300 group">
                  <Twitter className="w-4 h-4 text-slate-300 group-hover:text-data-primary transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-data-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-data-primary/30 transition-all duration-300 group">
                  <Linkedin className="w-4 h-4 text-slate-300 group-hover:text-data-primary transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-data-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-data-primary/30 transition-all duration-300 group">
                  <Github className="w-4 h-4 text-slate-300 group-hover:text-data-primary transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-data-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-data-primary/30 transition-all duration-300 group">
                  <Mail className="w-4 h-4 text-slate-300 group-hover:text-data-primary transition-colors" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg relative">
                Product
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-data-primary to-data-accent rounded-full"></div>
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="#features"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Features</span>
                </a>
                <a
                  href="#pricing"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Pricing</span>
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Dashboard</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">API</span>
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg relative">
                Company
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-data-secondary to-data-primary rounded-full"></div>
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Blog</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Careers</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg relative">
                Support
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-data-accent to-data-secondary rounded-full"></div>
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Help Center</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Documentation</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Community</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-300 hover:text-data-primary transition-all duration-300 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Status</span>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-slate-300 mb-6">Get the latest updates on new features, product announcements, and data storytelling insights.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-data-primary focus:border-transparent transition-all duration-300"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-data-primary to-data-accent text-white font-medium rounded-lg hover:from-data-primary/90 hover:to-data-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <p>© 2024 Narraviz. All rights reserved.</p>
              <div className="hidden md:flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="#" className="text-slate-400 hover:text-data-primary transition-colors duration-300 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-data-primary transition-colors duration-300 hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-data-primary transition-colors duration-300 hover:underline">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

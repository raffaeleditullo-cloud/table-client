import {
  Boxes, Workflow, Headset, ShoppingCart, BookLock, ShieldCheck,
  Stethoscope, UtensilsCrossed, ShoppingBag, House, Scale, Car, Factory, Landmark,
  Briefcase, GraduationCap, Rocket, LayoutGrid,
  MessageCircle, Phone, Layout, Mail, Send, Share2, Calendar, Server, CreditCard, Zap,
  Router, Monitor, Tablet, Receipt, Radio,
  User, UserRound, UsersRound, CalendarCheck, LifeBuoy, PhoneForwarded, Wrench,
  Euro, ArrowRightLeft, BadgeCheck, Layers, Scissors
} from 'lucide-react';

// Icon registry: catalog entries reference icons by name
export const ICONS = {
  Boxes, Workflow, Headset, ShoppingCart, BookLock, ShieldCheck,
  Stethoscope, UtensilsCrossed, ShoppingBag, House, Scale, Car, Factory, Landmark,
  Briefcase, GraduationCap, Rocket, LayoutGrid, Scissors,
  MessageCircle, Phone, Layout, Mail, Send, Share2, Calendar, Server, CreditCard, Zap,
  Router, Monitor, Tablet, Receipt, Radio,
  User, UserRound, UsersRound, CalendarCheck, LifeBuoy, PhoneForwarded, Wrench,
  Euro, ArrowRightLeft, BadgeCheck
};

export const getIcon = (name) => ICONS[name] || Layers;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ConfigurationCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  onButtonClick: () => void;
  iconBgColor: string;
  iconColor: string;
  borderHoverColor: string;
  shadowHoverColor: string;
  buttonBorderColor: string;
  buttonHoverBgColor: string;
}

export function ConfigurationCard({
  icon,
  title,
  description,
  features,
  buttonText,
  onButtonClick,
  iconBgColor,
  iconColor,
  borderHoverColor,
  shadowHoverColor,
  buttonBorderColor,
  buttonHoverBgColor,
}: ConfigurationCardProps) {
  return (
    <Card className={`group border-border/60 bg-card/60 backdrop-blur-md ${borderHoverColor} transition-all duration-300 hover:shadow-xl ${shadowHoverColor} hover:-translate-y-0.5`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg className={`w-4 h-4 ${iconColor} mt-0.5 shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            variant="outline" 
            className={`w-full ${buttonBorderColor} ${buttonHoverBgColor} transition-colors`}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

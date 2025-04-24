import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, AlertCircle, Globe, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hospital } from "@/lib/hospitals";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HospitalListProps {
  hospitals: Hospital[];
  title?: string;
}

export default function HospitalList({
  hospitals = [],
  title = "Nearby Hospitals",
}: HospitalListProps) {
  if (!hospitals || hospitals.length === 0) {
    return null;
  }

  const openMap = (lat: number, lon: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm shadow-md border border-primary/20 mt-4">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-primary" />
          {title}
          <Badge variant="outline" className="ml-auto text-xs bg-primary/5">
            {hospitals.length} {hospitals.length === 1 ? "Hospital" : "Hospitals"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {hospitals.map((hospital, index) => (
            <AccordionItem key={index} value={`hospital-${index}`}>
              <AccordionTrigger className="hover:bg-muted/50 px-3 rounded-md">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="font-medium text-left">{hospital.name}</div>
                  <Badge variant={hospital.emergency ? "destructive" : "secondary"} className="ml-2">
                    {hospital.distance}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="flex-1">{hospital.address}</span>
                  </div>
                  
                  {hospital.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${hospital.phone}`} className="text-primary hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                  )}
                  
                  {hospital.operatingHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{hospital.operatingHours}</span>
                    </div>
                  )}
                  
                  {hospital.emergency !== undefined && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Emergency Services: 
                        <Badge variant={hospital.emergency ? "destructive" : "outline"} className="ml-2">
                          {hospital.emergency ? "Available" : "Not Available"}
                        </Badge>
                      </span>
                    </div>
                  )}
                  
                  {hospital.services && hospital.services.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <span className="block mb-1">Services:</span>
                        <div className="flex flex-wrap gap-1">
                          {hospital.services.map((service, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {hospital.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => openMap(hospital.coordinates[0], hospital.coordinates[1], hospital.name)}
                    >
                      <MapPin className="h-4 w-4 mr-2" /> View on Map
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
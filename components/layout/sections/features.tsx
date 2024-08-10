import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "TabletSmartphone",
    title: "Mobile Friendly",
    description:
      "Our responsive user interface allows users to play with ease on a device of any size, including tablets and smartphones.",
  },
  {
    icon: "DollarSign",
    title: "Always Free",
    description:
      "We don't believe in charging you for education or recreation. Hence we provide a free and open-source solution for you to use.",
  },
  {
    icon: "Github",
    title: "Open Source",
    description:
      "Want to self host? We provide a free and open-source solution for you to use.",
  },
  {
    icon: "SlidersHorizontal",
    title: "Complete Control",
    description:
      "As the host, you have full control over your room, with the ability to clear individual or all buzzes and kick users from the room.",
  },
  {
    icon: "Laugh",
    title: "Ease of Use",
    description:
      "Simple and intuitive user interface, with a focus on ease of use.",
  },
  {
    icon: "User",
    title: "Large Rooms",
    description:
      "Each room can accommodate up to 100 participants, making it suitable for large gatherings.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What Makes Us Different
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Here's what makes TimesUp! the best online quiz solution for your quizzing needs.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

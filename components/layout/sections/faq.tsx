import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is this site free?",
    answer: "Yes. It is a completely free site. No ads, no tracking, no cookies.",
    value: "item-1",
  },
  {
    question: "How many particpants can I have?",
    answer:
      "You can have as many participants as you want. You can invite your friends to join. We recommeend you to have at least 5 particapants. ",
    value: "item-2",
  },
  {
    question:
      "How can I contribute to the project?",
    answer:
      "You can contribute to the project by giving us a star on Github. You can also contribute by creating a pull request. We are open to any contributions.",
    value: "item-3",
  },
  {
    question: "Why is sign up required?",
    answer: "We dont like bots. We want to make sure that only people who are real people are using the site.",
    value: "item-4",
  },
  {
    question:
      "More questions? Where can I ask them?",
    answer: "You can ask them on our Discord server.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

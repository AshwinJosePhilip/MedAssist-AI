import React from "react";
import ChatHeader from "./chat/ChatHeader";
import ChatWindow from "./chat/ChatWindow";
import ChatInput from "./chat/ChatInput";
import { chatWithMistral } from "@/lib/api";

const Home = () => {
  const [messages, setMessages] = React.useState([
    {
      id: "1",
      isBot: true,
      message: "Hello! I'm your medical assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [responses, setResponses] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      isBot: false,
      message: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const messageHistory = messages.map((msg) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.message,
      }));

      const {
        response,
        hospitals,
        nutritionPlan,
        workoutPlan,
        firstAidGuide,
        isFirstAid,
        sources,
      } = await chatWithMistral([
        {
          role: "system",
          content:
            "You are a medical assistant AI. Provide helpful medical advice while being clear that you are not a replacement for professional medical care.",
        },
        ...messageHistory,
        { role: "user", content: inputValue },
      ]);

      // Add source link to the bot response if available
      const botResponse = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        message: response,
        timestamp: new Date().toLocaleTimeString(),
        sourceLink:
          sources && sources.length > 0
            ? {
                title: sources[0].title,
                url: sources[0].url,
              }
            : undefined,
      };

      setMessages((prev) => [...prev, botResponse]);

      // Add response cards based on the type of information
      const newResponses = [];

      // Don't add the medical information card with the pin symbol
      // Just add the response to the messages array, which was already done above

      if (hospitals?.length > 0) {
        newResponses.push({
          id: (Date.now() + 1).toString(),
          type: "hospital-info",
          title: "Nearby Medical Facilities",
          content: "Here are the closest medical facilities to your location:",
          details: {
            location: hospitals[0].address,
            phone: hospitals[0].phone,
          },
        });
      }

      if (nutritionPlan) {
        newResponses.push({
          id: (Date.now() + 2).toString(),
          type: "diet-plan",
          title: "Recommended Meal Plan",
          content: "Based on your condition, here's a suggested meal plan:",
          details: {
            meals: nutritionPlan.meals,
          },
        });
      }

      if (workoutPlan) {
        newResponses.push({
          id: (Date.now() + 3).toString(),
          type: "workout-plan",
          title: "Recommended Workout Plan",
          content: "Here's a personalized workout plan based on your needs:",
          details: {
            workouts: workoutPlan.workouts,
          },
        });
      }

      if (isFirstAid && firstAidGuide) {
        newResponses.push({
          id: (Date.now() + 4).toString(),
          type: "first-aid-guide",
          title: `First Aid: ${firstAidGuide.condition}`,
          content: firstAidGuide.emergency
            ? "EMERGENCY: Call for help immediately"
            : "Follow these first aid steps carefully",
          details: {
            sources,
            condition: firstAidGuide.condition,
            emergency: firstAidGuide.emergency,
            emergencyContact: firstAidGuide.emergencyContact,
            timeFrame: firstAidGuide.timeFrame,
            firstAidSteps: firstAidGuide.steps,
            doNotDo: firstAidGuide.doNotDo,
          },
        });
      }

      setResponses(newResponses);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        message: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background/80 backdrop-blur-sm chat-pages">
      <ChatHeader status={isTyping ? "typing" : "online"} />
      <main className="flex-1 pt-16">
        <ChatWindow messages={messages} responses={responses} />
      </main>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};

export default Home;

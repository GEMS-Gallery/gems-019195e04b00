import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor GEMS {
  stable var conversationHistory : [(Text, Text)] = [];
  var messageCounter : Nat = 0;

  public func sendMessage(message : Text, response: Text) : async () {
    messageCounter += 1;
    conversationHistory := Array.append(conversationHistory, [(message, response)]);
  };

  public query func getConversationHistory() : async [(Text, Text)] {
    conversationHistory
  };

  public func clearConversationHistory() : async () {
    conversationHistory := [];
    messageCounter := 0;
  };

  public func generateFallbackResponse(message : Text) : async Text {
    if (Text.contains(Text.toLowercase(message), #text "hello")) {
      return "Hello! How can I assist you today?";
    } else if (Text.contains(Text.toLowercase(message), #text "bye")) {
      return "Goodbye! Have a great day!";
    } else {
      return "I'm sorry, I couldn't process your request at the moment. Could you please try again later or rephrase your question?";
    };
  };
}

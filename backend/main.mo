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

  public func generateResponse(message : Text) : async Text {
    if (Text.contains(Text.toLowercase(message), #text "hello")) {
      return "Hello! How can I assist you today?";
    } else if (Text.contains(Text.toLowercase(message), #text "bye")) {
      return "Goodbye! Have a great day!";
    } else {
      return "I'm here to help. Could you please provide more details or ask a specific question?";
    };
  };
}

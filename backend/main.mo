import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor GEMS {
  stable var conversationHistory : [(Text, Text)] = [];
  var messageCounter : Nat = 0;

  public func sendMessage(message : Text) : async Text {
    messageCounter += 1;
    let response = generateResponse(message);
    conversationHistory := Array.append(conversationHistory, [(message, response)]);
    response
  };

  public query func getConversationHistory() : async [(Text, Text)] {
    conversationHistory
  };

  private func generateResponse(message : Text) : Text {
    if (Text.contains(Text.toLowercase(message), #text "hello")) {
      return "Hello! How can I assist you today?";
    } else if (Text.contains(Text.toLowercase(message), #text "bye")) {
      return "Goodbye! Have a great day!";
    } else {
      return "I've searched for information related to your query. Please check the search result below for more details. If you need more specific information, feel free to ask another question.";
    };
  };
}

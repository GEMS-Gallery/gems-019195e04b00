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
}

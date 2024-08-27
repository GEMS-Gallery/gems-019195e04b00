export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'clearConversationHistory' : IDL.Func([], [], []),
    'generateResponse' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getConversationHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'sendMessage' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };

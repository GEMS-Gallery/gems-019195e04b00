import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { backend } from 'declarations/backend';

interface Message {
  text: string;
  isUser: boolean;
}

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await backend.getConversationHistory();
      const formattedHistory = history.flatMap(([userMsg, aiMsg]) => [
        { text: userMsg, isUser: true },
        { text: aiMsg, isUser: false }
      ]);
      setMessages(formattedHistory);
    };
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await backend.sendMessage(input);
      const aiMessage = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'background.default' }}>
        <Typography variant="h6">GEMS AI Chatbot</Typography>
      </Box>
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
          {messages.map((message, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                maxWidth: '70%',
                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: message.isUser ? 'primary.light' : 'secondary.light',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'secondary.main',
              }}
            >
              <Typography>{message.text}</Typography>
            </Paper>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                  disabled={isLoading}
                  startIcon={<SendIcon />}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'background.default',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                    },
                  }}
                >
                  Send
                </Button>
              ),
              style: { color: 'text.primary' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'secondary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default App;

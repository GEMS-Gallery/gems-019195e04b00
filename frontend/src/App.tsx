import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
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
      <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'background.paper' }}>
        <Typography variant="h6">GEMS AI Chatbot</Typography>
      </Box>
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {!message.isUser && <SmartToyIcon sx={{ mr: 1, alignSelf: 'flex-end', color: 'primary.main' }} />}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  borderRadius: '20px',
                  backgroundColor: message.isUser ? 'primary.light' : 'secondary.light',
                  color: 'text.primary',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 400 }}>{message.text}</Typography>
              </Paper>
              {message.isUser && <PersonIcon sx={{ ml: 1, alignSelf: 'flex-end', color: 'primary.main' }} />}
            </Box>
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
                    color: 'background.paper',
                    '&:hover': {
                      bgcolor: 'primary.dark',
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
                  borderColor: 'primary.light',
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

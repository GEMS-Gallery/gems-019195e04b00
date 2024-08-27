import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Container, Link } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { backend } from 'declarations/backend';

interface Message {
  text: string;
  isUser: boolean;
  searchResult?: {
    title: string;
    snippet: string;
    pageId: number;
  };
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

  const fetchWikipediaSearch = async (query: string) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.query && data.query.search && data.query.search.length > 0) {
        const result = data.query.search[0];
        return {
          title: result.title,
          snippet: result.snippet,
          pageId: result.pageid,
        };
      }
    } catch (error) {
      console.error('Error fetching Wikipedia search:', error);
    }
    return null;
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const searchResult = await fetchWikipediaSearch(input);
      const response = await backend.sendMessage(input);
      const aiMessage: Message = { 
        text: response, 
        isUser: false,
        searchResult: searchResult || undefined
      };
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
                flexDirection: 'column',
                alignItems: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                {!message.isUser && <SmartToyIcon sx={{ mr: 1, mb: 1, color: 'primary.main' }} />}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.isUser ? 'background.paper' : 'primary.light',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Paper>
                {message.isUser && <PersonIcon sx={{ ml: 1, mb: 1, color: 'primary.main' }} />}
              </Box>
              {message.searchResult && (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mt: 1,
                    maxWidth: '70%',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <Typography variant="subtitle2">Search Result:</Typography>
                  <Typography variant="body2">
                    <strong>{message.searchResult.title}</strong>
                  </Typography>
                  <Typography variant="body2" dangerouslySetInnerHTML={{ __html: message.searchResult.snippet }} />
                  <Link 
                    href={`https://en.wikipedia.org/?curid=${message.searchResult.pageId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </Link>
                </Paper>
              )}
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
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

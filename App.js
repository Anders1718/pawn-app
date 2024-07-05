import Main from './src/components/Main';
import { NativeRouter } from 'react-router-native';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client'
import createApolloClient from './src/utils/apolloClient';


const apolloClient = createApolloClient()

export default function App() {

  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar style='light' />
      <NativeRouter>
        <Main />
      </NativeRouter>
    </ApolloProvider>
  );
}
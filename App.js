import Main from './src/components/Main';
import { NativeRouter } from 'react-router-native';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client'
import createApolloClient from './src/utils/apolloClient';
import { StyleSheet} from 'react-native';
import { useFonts } from 'expo-font';


const apolloClient = createApolloClient()

export default function App() {
  
  // const showNames = () => {
  //   return names.map((name, index) => {
  //     console.log('name', name)
  //     return (
  //       <View key={index} style={styles.row}>
  //         <Text>{name.nombre_finca}</Text>
  //         <Text>{name.nombre_propietario}</Text>
  //         <Text>{name.ubicacion}</Text>
  //         <Text>{name.nit}</Text>
  //       </View>
  //     );
  //   })
  // }

  // const addFinca = () => {
  //   db.transaction(tx => {
  //     tx.executeSql('INSERT INTO fincas (nombre_finca, nombre_propietario, ubicacion, nit) values (?, ?, ?, ?)', [currentName, 'juan', 'sabanazo', '23232366-9'],
  //     (txObj, resultSet) => {
  //       let existingNames = [...names];
  //       existingNames.push({id: resultSet.insertId, name: currentName});
  //       setNames(existingNames)
  //       setCurrentName(undefined)
  //     },
  //     (txObj, error) => console.log(error)
  //   )
  //   })
  // }

  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar style='light' />
      <NativeRouter>
        <Main />
      </NativeRouter>
    </ApolloProvider>
  );

  // return (
  //   <View style={styles.container}>
  //     <TextInput value={currentName} placeholder='Registrar Finca' onChangeText={setCurrentName} />
  //     <Button title='Add finca' onPress={addFinca} />
  //     {showNames()}
  //     <StatusBar style='auto' />
  //   </View>
  // )
}
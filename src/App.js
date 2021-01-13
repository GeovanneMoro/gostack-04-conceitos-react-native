import React from 'react';
import api from './services/api';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [repositories, setRepositories] = React.useState([]);

  React.useEffect(() => {
    api.get('repositories').then((response) => setRepositories(response.data));
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const likedRepository = response.data;
    const repositoriesUpdate = repositories.map((repository) => {
      if (repository.id === id) {
        return likedRepository;
      } else {
        return repository;
      }
    });

    setRepositories(repositoriesUpdate);
  }

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Novo ${Date.now()}`,
      url: 'Url teste',
      techs: ['node', 'ReactJS'],
    });
    const newRepository = response.data;
    setRepositories([...repositories, newRepository]);
  }

  async function handleDeleteRepository(id) {
    await api.delete(`repositories/${id}`);

    setRepositories(repositories.filter((repository) => repository.id !== id));
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
            <View key={repository.id} style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {repository.techs.map((tech, index) => (
                  <Text key={index} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes > 1
                    ? `${repository.likes} curtidas`
                    : `${repository.likes} curtida`}
                </Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDeleteRepository(repository.id)}
                >
                  <Text style={styles.buttonText}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonAddText}>Adicionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    width: 100,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#7159c1',
    alignItems: 'center',
  },
  buttonText: {
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    padding: 15,
  },
  buttonAdd: {
    margin: 15,
    width: 200,
    backgroundColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonAddText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',

    padding: 15,
  },
});

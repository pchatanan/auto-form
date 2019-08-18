import React from 'react'
import firebase from 'firebase'

const useFirebaseCollection = (path) => {
  const [documents, setDocuments] = React.useState([])
  React.useEffect(() => {
    return firebase.firestore().collection(path)
      .onSnapshot((querySnapshot) => {
        var newDocuments = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          newDocuments.push({ id: doc.id, data: doc.data() })
        });
        setDocuments(newDocuments)
      })
  }, [])
  const remove = (docId) => {
    firebase.firestore().collection(path).doc(docId).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }
  return [documents, { remove }]
}

const Manager = props => {
  const [templates, perform] = useFirebaseCollection('templates')
  return <div>
    {templates.map((template, index) => {
      console.log(template)
      return <div key={index}>
        {template.data.formName}
        <button onClick={e => {
          perform.remove(template.id)
        }}>remove</button>
        <button onClick={e => {
          props.history.push(`/manage/${template.id}`)
        }}>view</button>
      </div>
    })}
  </div>
}

export default Manager
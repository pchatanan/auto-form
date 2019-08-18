import React from 'react'
import firebase from 'firebase'

const ManageTemplate = props => {
  const [formName, setFormName] = React.useState('')
  const [forms, setForms] = React.useState([])
  const [keys, setKeys] = React.useState([])
  const [key, setKey] = React.useState(null)
  const [method, setMethod] = React.useState('equals')
  const [value, setValue] = React.useState('')
  const [results, setResults] = React.useState([])
  const [showSearch, setShowSearch] = React.useState(false)
  const templateId = props.match.params.id
  React.useEffect(() => {
    return firebase.firestore().collection('templates').doc(templateId).onSnapshot((doc) => {
      var temp = ['Notes']
      setFormName(doc.data().formName)
      doc.data().formSpec.forEach(item => {
        temp.push(item.name)
      })
      setKey(temp[0])
      setKeys(temp)
    });
  }, [templateId])
  React.useEffect(() => {
    return firebase.firestore().collection('templates').doc(templateId).collection('data').onSnapshot((querySnapshot) => {
      var temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setForms(temp)
    });
  }, [templateId])
  return <div>
    <h1>{formName}</h1>
    <hr></hr>
    <h3>Search Filter</h3>
    <label>Key</label>
    {key && <select value={key} onChange={e => { setKey(e.target.value) }}>
      {keys.map((key, idx) => {
        return <option key={idx} value={key}>{key}</option>
      })}
    </select>}
    <select value={method} onChange={e => { setMethod(e.target.value) }}>
      <option value={'equals'}>{'equals'}</option>
      <option value={'contains'}>{'contains'}</option>
    </select>
    <label>Value</label>
    <input value={value} onChange={e => { setValue(e.target.value) }}></input>
    <button onClick={e => {
      const temp = forms.filter(form => {
        if (key === 'Notes' && method === 'contains') {
          var result = false
          form.data.Notes.forEach(note => {
            if (note.text.includes(value.trim())) {
              result = true
            }
          })
          return result
        }
        if (method === 'equals') {
          if (form.data[key].text.trim() == value.trim()) {
            return true
          }
          else {
            return false
          }
        }
        else if (method === 'contains') {
          if (form.data[key].text.trim().includes(value.trim())) {
            return true
          }
          else {
            return false
          }
        }
      })
      setResults(temp)
      setShowSearch(true)
    }}>Search</button>
    {!showSearch && forms.map((form, idx) => {
      return <div key={idx}>
        <hr></hr>
        {Object.keys(form.data).map((key, idx) => {
          return <p key={idx}>{`${key}: ${form.data[key].text}`}</p>
        })}
        <button onClick={e => { props.history.push(`/manage/${templateId}/${form.id}`) }}>View full details</button>
      </div>
    })}
    {showSearch && <>
      <h3>Search Result</h3>
      <button onClick={e => { setShowSearch(false) }}>Close search</button>
    </>}
    {showSearch && results.map((form, idx) => {
      return <div key={idx}>
        <hr></hr>
        {Object.keys(form.data).map((key, idx) => {
          return <p key={idx}>{`${key}: ${form.data[key].text}`}</p>
        })}
        <button onClick={e => { props.history.push(`/manage/${templateId}/${form.id}`) }}>View full details</button>
      </div>
    })}
  </div>
}

export default ManageTemplate
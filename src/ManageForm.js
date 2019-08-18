import React from 'react'
import firebase from 'firebase'

const ManageForm = props => {
  const [form, setForm] = React.useState(null)
  const [template, setTemplate] = React.useState(null)
  const [textNote, setTextNote] = React.useState('')
  const templateId = props.match.params.id
  const formId = props.match.params.formId
  React.useEffect(() => {
    return firebase.firestore().collection('templates').doc(templateId).onSnapshot(doc => {
      setTemplate(doc.data())
    })
  }, [templateId])
  React.useEffect(() => {
    return firebase.firestore().collection('templates').doc(templateId).collection('data').doc(formId)
      .onSnapshot(doc => {
        setForm(doc.data())
      })
  }, [formId, templateId])
  return <div>
    {template && <h1>{template.formName}</h1>}
    {form && Object.keys(form).filter(key => key != 'Notes').map((key, idx) => {
      return <div key={idx}>
        <p>{`${key}: ${form[key].text}`}</p>
        <img src={form[key].url} />
      </div>
    })}
    <div>
      <h3>Notes:</h3>
      {form && form.Notes.map((note, idx) => {
        console.log(note.created)
        const d = note.created.toDate()
        var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
          d.getHours() + ":" + d.getMinutes();
        return <div key={idx}>
          <p>{note.text}</p>
          <p>{datestring}</p>
          <button onClick={e => {
            firebase.firestore().collection('templates').doc(templateId).collection('data').doc(formId)
              .update({
                Notes: firebase.firestore.FieldValue.arrayRemove(note)
              });
          }}>remove</button>
        </div>
      })}
      <label>Note:</label>
      <textarea value={textNote} onChange={e => { setTextNote(e.target.value) }}></textarea>
      <button onClick={e => {
        firebase.firestore().collection('templates').doc(templateId).collection('data').doc(formId)
          .update({
            Notes: firebase.firestore.FieldValue.arrayUnion({
              text: textNote,
              created: firebase.firestore.Timestamp.fromDate(new Date())
            })
          });
      }}>Add note</button>
    </div>
  </div>
}

export default ManageForm
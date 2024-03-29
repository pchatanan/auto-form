import React from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

const DownloadPage = props => {
  const [templates, setTemplates] = React.useState([])
  const handleTemplatesChange = () => {
    var finishedDownloading = templates.filter(template => template.selected && template.forms === undefined).length === 0
    if (finishedDownloading && templates.filter(template => template.selected).length > 0) {
      console.log('Finished downloading!')
      const rows = []
      const headers = getColumns()
      rows.push(headers)

      var addedPeople = []
      templates.filter(template => template.selected).forEach(selectedTemplate => {
        selectedTemplate.forms.forEach(form => {
          var added = false
          addedPeople.forEach(people => {
            const sameFirstname = people['First name'].trim() === form['First name'].text.trim()
            const sameLastname = people['Last name'].trim() === form['Last name'].text.trim()
            const sameDOB = people['DOB'].trim() === form['DOB'].text.trim()
            if (sameFirstname && sameLastname && sameDOB) {
              added = true
            }
          })

          if (!added) {
            var currentForm = { ...form }
            templates.filter(template => template.selected && template.id !== selectedTemplate.id)
              .forEach(otherTemplate => {
                otherTemplate.forms.forEach(otherForm => {
                  const sameFirstname = otherForm['First name'].text.trim() === currentForm['First name'].text.trim()
                  const sameLastname = otherForm['Last name'].text.trim() === currentForm['Last name'].text.trim()
                  const sameDOB = otherForm['DOB'].text.trim() === currentForm['DOB'].text.trim()
                  if (sameFirstname && sameLastname && sameDOB) {
                    currentForm = { ...currentForm, ...otherForm }
                  }
                })
              })
            var currentRow = []
            headers.forEach(header => {
              currentRow.push('')
            })
            headers.forEach((header, index) => {
              if (currentForm[header] !== undefined) {
                currentRow[index] = currentForm[header].text.trim()
              }
            })
            rows.push(currentRow)
            addedPeople.push({
              'First name': currentForm['First name'].text,
              'Last name': currentForm['Last name'].text,
              'DOB': currentForm['DOB'].text
            })
          }
        })
      })
      exportToCsv('test.csv', rows)
    }
  }
  const fetchTemplates = () => {
    firebase.firestore().collection('templates').get()
      .then((querySnapshot) => {
        var newTemplates = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          newTemplates.push({ id: doc.id, data: doc.data(), selected: false })
        });
        setTemplates(newTemplates)
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
  React.useEffect(handleTemplatesChange, [templates])
  React.useEffect(fetchTemplates, [])

  const getColumns = () => {
    var temp = ['First name', 'Last name', 'DOB']
    templates.filter(template => template.selected)
      .forEach(template => {
        template.data.formSpec.filter(spec => {
          return spec.name !== 'First name' && spec.name !== 'Last name' && spec.name !== 'DOB'
        }).forEach(spec => {
          temp.push(spec.name)
        })
      })
    return temp
  }

  const exportToCsv = (filename, rows) => {
    var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null || row[j] === undefined ? '' : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        };
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
        if (j > 0)
          finalVal += ',';
        finalVal += result;
      }
      return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  return <div>
    <h1 style={{ textAlign: 'center' }}>Download .csv file</h1>
    <h3 style={{ textAlign: 'center' }}>Select form(s) to download</h3>
    <div style={{ textAlign: 'center' }}>
      {templates.map((template, index) => {
        return <div key={index}>
          <input type='checkbox' onChange={e => {
            var temp = [...templates]
            temp[index].selected = e.target.checked
            setTemplates(temp)
          }} />
          {template.data.formName}
        </div>
      })}
      <button onClick={e => {
        templates.filter(template => template.selected).forEach(template => {
          firebase.firestore().collection('templates').doc(template.id).collection('data').get()
            .then((querySnapshot) => {
              var temp = []
              querySnapshot.forEach(doc => {
                temp.push(doc.data())
              })
              var newTemplate = { ...template }
              newTemplate.forms = temp
              setTemplates(oldTemplates => {
                var newTemplates = [...oldTemplates]
                var index = 0
                newTemplates.forEach((t, idx) => {
                  if (t.id === newTemplate.id) {
                    index = idx
                  }
                })
                newTemplates[index] = newTemplate
                return newTemplates
              })
            })
        })
      }}>Download Now</button>
    </div>
  </div>
}

export default DownloadPage

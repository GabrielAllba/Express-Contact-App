const express = require('express')
const app = express()
const port = 3000;

const contactsMethod = require('./utils/contacts')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

//konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
  cookie: {maxAge: 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

//validation form 
const {body, validationResult, check} = require('express-validator')

//body is for get what the user inputting to the form
//validationResult is for saving data validation, is it accepted or not
//tell express to use ejs
app.set('view engine', 'ejs')


//Application level middleware
app.use((req,res, next) => {
  console.log('Time:  ' + Date.now())
  next()
})
app.use(express.urlencoded({extended: true}))
//BUILT IN MIDDLEWARE
app.use(express.static('public'))
app.get('/', (req, res) => {
  //res.sendFile('./index.html', {root:__dirname})


  const mahasiswa = [
    {
      nama: 'Gabriel Allba Shemi Yuma',
      email: 'Riel@gmail.com'
    },
    {
      nama: 'Firman',
      email: 'firman@gmail.com'
    },
    {
      nama: 'Utina',
      email: 'utina@gmail.com'
    }
  ]
  res.render('index', {
    title: 'Halaman utama',
    mahasiswa: mahasiswa
  })
})
app.get('/about', (req,res) => {
   // res.sendFile('./about.html', {root: __dirname})
   res.render('about', {
     title: 'Halaman About'
   })
})
app.get('/contact', (req,res) => {
  const contacts = contactsMethod.loadContact()
  res.render('contact', {
    title: 'Halaman Contact',
    contacts: contacts,
    msg: req.flash('msg')
  })
})

//halaman form tambah data kontak
app.get('/contact/add', (req,res) => {
  res.render('add-contact', {
    title: 'Form tambah data kontak',
    
  })
})

//proses data kontak
app.post('/contact',[

  //parameter 1 berdasarkan name
  check('email', 'email tidak valid').isEmail(),
  check('nohp', 'nomer hp tidak valid').isMobilePhone('id-ID'),
  body('nama').custom((value) => {
    const duplikat = contactsMethod.cekDuplikat(value)
    if(duplikat){
      //throw new err return false automatically
      throw new Error('nama sudah ada, silahkan gunakan nama lain')
    }
    return true
  })
], (req,res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.render('add-contact', {
      title: 'Tambah Kontak Baru',
      errors: errors.array()
    })
  }
  else{
    contactsMethod.addContact(req.body)

    //kirimkan flash message
    req.flash('msg', 'Data contact berhasil ditambahkan')
    res.redirect('/contact')
  }
})
 
//proses ubah data kontak
app.post('/contact/update',[

  //parameter 1 berdasarkan name
  check('email', 'email tidak valid').isEmail(),
  check('nohp', 'nomer hp tidak valid').isMobilePhone('id-ID'),
  body('nama').custom((value, { req }) => {
    const duplikat = contactsMethod.cekDuplikat(value)
    if(value != req.body.oldNama && duplikat){
      //throw new err return false automatically
      throw new Error('nama sudah ada, silahkan gunakan nama lain')
    }
    return true
  })
], (req,res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.render('edit-contact', {
      title: 'Update Data Kontak',
      errors: errors.array(),
      contact: req.body
    })
  }
  else{
    // res.send(req.body)
    // contactsMethod.addContact(req.body)

    //kirimkan flash message
    contactsMethod.updateContacts(req.body)
    req.flash('msg', 'Data contact berhasil diubah')
    res.redirect('/contact')
  }
})


//form ubah data kontak
app.get('/contact/edit/:nama', (req,res) => {
  const findContact = contactsMethod.findContact(req.params.nama)
  res.render('edit-contact', {
    title: 'Form Ubah Data Kontak',
    contact: findContact
  })
})


//proses delete contact
app.get('/contact/delete/:nama', (req,res) => {
  const contact = contactsMethod.findContact(req.params.nama)
  if(!contact){
    res.status(404)
    res.send("<h1>404</h1>")
  }
  else{
    contactsMethod.deleteContact(req.params.nama)
    req.flash('msg', `data ${req.params.nama} berhasil dihapus!`)
    res.redirect('/contact')
  }
})
//halaman detail contact
app.get('/contact/:nama', (req,res) => {
  const contact = contactsMethod.findContact(req.params.nama)

  res.render('detail', {
    title: 'Halaman detail',
    contact: contact
  })
})
app.get('/product/:id/category/:idCat', (req,res) => {
  res.send(`Product id: ${req.params.id} <br> category id: ${req.params.idCat}`)
})

app.use('/', (req,res) => {
  res.status(404)
  res.send('halaman tidak ada sebenarnya')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




















// //menggunakan core module node js untuk membuat web server

// const http = require('http')
// const fs = require('fs')

// const port = 3000
// //make server

// const renderHTML = (path, res) => {
//     fs.readFile(path, (err, data) => {
//         if(err){
//             res.writeHead(404)
//             res.write('Error: file not found')
//         }
//         else{
//             res.write(data)
//         }
//         res.end()
//     })
// }
// const server = http.createServer((req,res) => {

    
//     //apa yang mau kita tampilin

//     res.writeHead(200, {
//         'Content-Type' : 'text/html'
//     })

//     const url = req.url

//     //ga bagus, copypaste dan ngulang ngulang
//     if(url == '/about'){
//         renderHTML('./about.html', res)
//     }
//     else if(url == '/contact'){
//         res.write('<h1>Ini adalah halaman contact</h1>')
//         res.end()
//     }
//     else{
//         renderHTML('./index.html', res)
//     }
// })
// //menjalankan server
// server.listen(port, () => {
//     console.log(`Server is listening on port ${port}`)
// })

/*
const http = require('http')
const fs = require('fs')

const requestListener = (req,res) => {
  fs.readFile = (err, data) => {
    res.writeHead(200, {'Content Type': 'text/html'})
    if(err){
      res.status(404)
      res.write(err)
      res.end()
    }
    else{
      res.write('berhasil')
      res.end()
    }
  }
}

const server = http.createServer(requestListener)
server.listen(3000)
*/

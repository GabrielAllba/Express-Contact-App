const fs = require('fs')

//Buat folder data jika belum ada
const dirPath = './data'
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

const contactPath = './data/contacts.json'
if(!fs.existsSync(contactPath)){
    fs.writeFileSync(contactPath, '[]', 'utf-8')
}

const loadContact = () => {
    const fileBuffer = fs.readFileSync('./data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}


//Cari kontak berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.nama.toLowerCase() == nama.toLowerCase())
    return contact
}

//menuliskan contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2))
}

//cek nama yang duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama === nama)
}

// menambahkan data kontak baru
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

//delete contact
const deleteContact= (nama) => {
    const contacts = loadContact()
    const newContacts = contacts.filter((contact) => 
        contact.nama.toLowerCase() != nama.toLowerCase()
    )
    saveContacts(newContacts)
}

//fungsi update contact
const updateContacts = (contactBaru) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
    console.log(contacts,filteredContacts, contactBaru)
    delete contactBaru.oldNama
    filteredContacts.push(contactBaru)
    saveContacts(filteredContacts)
}

module.exports = {loadContact, findContact, 
    addContact, cekDuplikat, deleteContact, updateContacts}
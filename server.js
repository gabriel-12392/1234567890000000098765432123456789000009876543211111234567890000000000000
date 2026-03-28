const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = './users.json';

// მონაცემების წაკითხვა ფაილიდან
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// მონაცემების ჩაწერა ფაილში
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ყველა მომხმარებლის წამოღება
app.get('/api/users', (req, res) => {
    res.json(readData());
});

// რეგისტრაცია
app.post('/api/register', (req, res) => {
    const users = readData();
    users.push(req.body);
    writeData(users);
    res.json({ message: "წარმატებით დარეგისტრირდა" });
});

// ბალანსის განახლება
app.post('/api/update-balance', (req, res) => {
    const { code, amount, type } = req.body;
    let users = readData();
    const index = users.findIndex(u => u.code === code);
    
    if (index !== -1) {
        if (type === 'add') users[index].balance += amount;
        else users[index].balance -= amount;
        writeData(users);
        res.json(users[index]);
    } else {
        res.status(404).json({ message: "ვერ მოიძებნა" });
    }
});

app.listen(3000, () => console.log('სერვერი ჩაირთო პორტზე 3000'));

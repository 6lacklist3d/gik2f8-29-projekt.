const express = require('express');
const app = express();

const fs = require('fs/promises');

const PORT = 5000;
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

  app.get('/users', async (req, res) => {
    // console.log('Read');
    try {
        const users = await fs.readFile('./users.json');
        res.send(JSON.parse(users));
    } catch (error) {
        res.status(500).send({ error });
    }
});

app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const listBuffer = await fs.readFile('./users.json');
    const currentUsers = JSON.parse(listBuffer);
    let maxUserId = 1;
    if (currentUsers && currentUsers.length > 0) {
      maxUserId = currentUsers.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
          maxUserId
      );
    }

    const newUser = { id: maxUserId + 1, ...user };
    const newList = currentUsers ? [...currentUsers, newUser] : [newUser];

    await fs.writeFile('./users.json', JSON.stringify(newList));
    
    res.send(newUser);
  } catch (error) {

    res.status(500).send({ error: error.stack });
  }
});

app.delete('/users/:id', async (req, res) => {
  console.log(req);
  try {
    
    const id = req.params.id;

    const listBuffer = await fs.readFile('./users.json');

    const currentUsers = JSON.parse(listBuffer);
    
    if (currentUsers.length > 0) {
      
      await fs.writeFile(
        './users.json',
        JSON.stringify(currentUsers.filter((user) => user.id != id))
      );
     
      res.send({ message: `User med id ${id} togs bort` });
    } else {
      
      res.status(404).send({ error: 'Ingen user att ta bort' });
    }
  } catch (error) {
   
    res.status(500).send({ error: error.stack });
  }
});

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva en funktion som likt post eller delete tar kan hantera PUT- eller PATCH-anrop (du får välja vilket, läs på om vad som verkar mest vettigt för det du ska göra) för att kunna markera uppgifter som färdiga. Den nya statusen - completed true eller falase - kan skickas i förfrågans body (req.body) tillsammans med exempelvis id så att man kan söka fram en given uppgift ur listan, uppdatera uppgiftens status och till sist spara ner listan med den uppdaterade uppgiften */

/* Observera att all kod rörande backend för labb 2 ska skrivas i denna fil och inte i app.node.js. App.node.js är bara till för exempel från lektion 5 och innehåller inte någon kod som används vidare under lektionerna. */
/***********************Labb 2 ***********************/

/* Med app.listen säger man åte servern att starta. Första argumentet är port - dvs. det portnummer man vill att servern ska köra på. Det sattes till 5000 på rad 9. Det andra argumentet är en anonym arrow-funktion som körs när servern har lyckats starta. Här skrivs bara ett meddelande ut som berättar att servern kör, så att man får feedback på att allt körts igång som det skulle. */
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./users.json');
    const putUsers = JSON.parse(listBuffer);

    putUsers.forEach(user => {
      if (user.id == id && user.completed == false){
        user.completed = true;
      }
      else if (user.id == id && user.completed == true) {
        user.completed = false;
      }
      
    });
    await fs.writeFile("./users.json", JSON.stringify(putUsers));
    res.send({ message : 'user with ${id} is updated'})
  }
  catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));

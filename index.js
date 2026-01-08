import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import express from "express";
import cors from 'cors';

export const generateUsers = (length = 500) => {
  return Array.from({ length }, (_, i) => {
    const id = uuidv4();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    const age = faker.number.int({ min: 18, max: 65 });
    return { id, name, email, age };
  });
};

const app = express();
const PORT = 3000;

app.use(cors())

app.get("/api/users", (req, res) => {
  const length = Number.parseInt(req.query.length) || 500;
  const users = generateUsers(length);
  res.json(users);
});

// add api for pagination
app.get("/api/users/paginated", (req, res) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 10;  
  const allUsers = generateUsers(500);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = allUsers.slice(startIndex, endIndex);
  res.json({
    page,
    limit,
    total: allUsers.length,
    users: paginatedUsers,
  });
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;

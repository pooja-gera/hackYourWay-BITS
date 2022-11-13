import { AshKetchup } from "@prisma/client";
import axios from "axios";
import express from "express";
import prisma from "../db/PrismaClient";
import { IAshKetchup } from "../interfaces/user";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  // fetch random joke from API
  const { data } = await axios.get("https://api.chucknorris.io/jokes/random");
  res.status(200).json({
    message: "Hello World",
    joke: data.value,
  });
});

// app.post("/", async (req, res) => {
//   const { hNo, state, assConstName, partNumber, name } = req.body;
//   try {
//     const { data: randomUsers } = await axios.get<IAshKetchup>(
//       "https://randomuser.me/api/?results=100"
//     );
//     const users = randomUsers.results.map((user) => {
//       return {
//         hNo: String(user.location.street.number + user.location.street.name),
//         state: String(user.location.state),
//         assConstName: String(user.location.city),
//         partNumber: String(user.location.postcode),
//         name: String(user.name.first + user.name.last),
//       };
//     });
//     const result = await prisma.ashKetchup.createMany({
//       data: users,
//       skipDuplicates: true,
//     });
//     console.log(result);
//     res.status(200).json({
//       message: "Success",
//       result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

app.delete("/delete", async (req, res) => {
  try {
    const result = await prisma.ashKetchup.deleteMany();
    res.status(200).json({
      message: "Success",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/create", async (req, res) => {
  try {
    const { body } = req;
    const dataToBeInserted = body.map((item: IAshKetchup) => {
      return {
        Name: item.Name,
        HouseNo: String(item.HouseNo),
        AssemblyConstituencyName: item.AssemblyConstituencyName,
        SectionNo: item.SectionNo,
        PartNo: item.PartNo,
        FatherName: item.FatherName,
        MotherName: item.MotherName,
        HusbandName: item.HusbandName,
        Age: item.Age,
        Sex: item.Sex,
      };
    });
    const result = await prisma.ashKetchup.createMany({
      data: dataToBeInserted,
      skipDuplicates: true,
    });
    res.status(200).json({
      message: "Success",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/all", async (req, res) => {
  try {
    const result = await prisma.ashKetchup.findMany();
    res.status(200).json({
      message: "Success",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

function getRelationshipsBetweenFamilyMembers(family: AshKetchup[]) {
  let relationships: { person: string | null; relation: string }[][] = [];
  for (let i = 0; i < family.length; i++) {
    const member = family[i];
    const father = family.find((item) => item.Name === member.FatherName);
    const mother = family.find((item) => item.Name === member.MotherName);
    const husband = family.find((item) => item.Name === member.HusbandName);
    const wife = family.find((item) => item.HusbandName === member.Name);
    const children = family.filter((item) => item.FatherName === member.Name);
    const siblings = family.filter(
      (item) => item.FatherName === member.FatherName
    );
    const grandChildren = family.filter(
      (item) => item.FatherName === children[0]?.Name
    );
    const grandParents = family.filter(
      (item) => item.Name === father?.FatherName
    );
    // Output Format: { “persons”: [ { “name”: “abcd efgh”, “relation”: “self” }, {“name”: “xyz ”, “relation”: “parent”}, {“name”: “blee “, “relation”: “parent”}]}
    relationships.push([{ person: member.Name, relation: "self" }]);
    if (father) {
      relationships[i].push({ person: father.Name, relation: "father" });
    }
    if (mother) {
      relationships[i].push({ person: mother.Name, relation: "mother" });
    }
    if (husband) {
      relationships[i].push({ person: husband.Name, relation: "husband" });
    }
    if (wife) {
      relationships[i].push({ person: wife.Name, relation: "wife" });
    }
    if (children.length) {
      children.forEach((child) => {
        relationships[i].push({ person: child.Name, relation: "child" });
      });
    }
    if (siblings.length) {
      // remove self from siblings
      siblings.splice(siblings.indexOf(member), 1);
      siblings.forEach((sibling) => {
        relationships[i].push({ person: sibling.Name, relation: "sibling" });
      });
    }
    if (grandChildren.length) {
      grandChildren.forEach((grandChild) => {
        relationships[i].push({
          person: grandChild.Name,
          relation: "grandchild",
        });
      });
    }
    if (grandParents.length) {
      grandParents.forEach((grandParent) => {
        relationships[i].push({
          person: grandParent.Name,
          relation: "grandparent",
        });
      });
    }
  }
  return relationships;
}

app.post("/get", async (req, res) => {
  const { body } = req;
  try {
    const allUsers = await prisma.ashKetchup.findMany({
      where: {
        AND: [
          {
            HouseNo: {
              equals: body.HouseNo,
            },
          },
          {
            Name: {
              equals: body.Name,
            },
          },
          {
            AssemblyConstituencyName: {
              equals: body.AssemblyConstituencyName,
            },
          },
          {
            PartNo: {
              equals: body.PartNo,
            },
          },
          {
            SectionNo: {
              equals: body.SectionNo,
            },
          },
          {
            FatherName: {
              equals: body.FatherName,
            },
          },
          {
            MotherName: {
              equals: body.MotherName,
            },
          },
          {
            HusbandName: {
              equals: body.HusbandName,
            },
          },
          {
            Age: {
              equals: body.Age,
            },
          },
          {
            Sex: {
              equals: body.Sex,
            },
          },
        ],
      },
    });
    let result;
    if (allUsers.length === 0) {
      result = "No data found";
    } else {
      // fetch families of all the users living in the same HouseNo
      result = await Promise.all(
        allUsers.map(async (user) => {
          const family = await prisma.ashKetchup.findMany({
            where: {
              HouseNo: {
                equals: user.HouseNo,
              },
              AND: {
                AssemblyConstituencyName: {
                  equals: user.AssemblyConstituencyName,
                },
                PartNo: {
                  equals: user.PartNo,
                },
                SectionNo: {
                  equals: user.SectionNo,
                },
              },
            },
          });
          return family;
        })
      );
    }

    // find the relationships of family members of the users in result
    let finalResult;
    if (result !== "No data found" && typeof result !== "string") {
      finalResult = result.map((family) => {
        return getRelationshipsBetweenFamilyMembers(family);
      });
    }
    res.status(200).json({
      message: "Success",
      result: finalResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);

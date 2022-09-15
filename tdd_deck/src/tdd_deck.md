---
author: <div>&bull;&bull;&bull;<br />Jakob Leczinsky @ SeenThis</div>
title: Hands on TDD
subtitle: Javascript 
css: ./assets/styles.css
---

### About me

```{.json}
{
  "name": "Jakob Leczinsky",
  "kind": "Software developer since 2008",
  "current_status": "Lead developer at SeenThis",
  "experience": [
    {
      "Cision",
      "Max Matthiessen",
      "MyTaste",
      "(Cygni) Dagens Nyheter/Dagens Industri",
      "(Cygni) Discovery",
      "(Cygni) </salt>",
      "(Cygni) Flexibla Kontoret",
      "(Cygni) Riksbanken",
      "SeenThis"
    }
  ]
}
```

---

### About SeenThis

```json
{
  "organization": "SeenThis",
  "business": {
    "type": "Adaptive streaming technology",
    "edge": "Reducing data transfer and CO2 footprint"
  },
  "technology": {
    "platform": [
      "web",
      "cloud"
    ],
    "languages": [
      "Javascript",
      "C++",
      "WASM",
      "Python"
    ]
  }
}
```

# Testing code 

::: notes

Quickly go through different kind of tests.

Important to have a strategy and stick to it.

**In what phase of the development cycle do you run your tests?**

When to run unit tests? When to run integration tests?

Is your test suite a vital part of the CI/CD pipeline or not?

What is the purpose of every test type and every test?

:::

## What is a test? 


:::{.incremental}
- Manual
- Automatic 
:::

:::{.fragment .fade-down}

![](./assets/wordcloud.svg)

:::

:::{.notes}
**Before we continue - make sure we define our terminology**

You usually test a lot more than you think! (manual tests)

Usually you should use a combination of these test catories.
At least use both _unit tests and integration tests_.

Next: Go through a few coding principles that helps with tests and design.

:::

# Divide and Conquer 

Divide complex tasks into multiple managable subtasks and deal with any 
complexity "later".

:::{.fragment .fade-right}
Doing so will naturally segment the
code into smaller loosely coupled units. 
:::

:::{.fragment .fade-right}
_This goes hand in hand with good
software design!_
:::

::: notes

Divide until the complexity becomes trivial. 

:::

# Inversion of Control

:::{.notes}

Inverion of Control is a design principle where the creation of instances 
is created outside of the current scope. The creation of instances is handed
over to an outer scope, a callback function or to a framework.

**I will use IoC througout the rest of this talk**

:::

## Dependency Injection

Implementation of IoC where instances are _injected_
into the scope through the constructor or through setters.

:::{.notes}

Composition over inheritance in object oriented programming.

(Could be injected by a framework)

:::

## Why is IoC good for testing? 

Promotes loosely coupled code.

Stubbing/mocking/faking becomes easy. The code becomes _testable_!



## Example: Dealing external resources

```{.javascript}
handler: async (_, reply) => {
  const response = await fetch(
    "https://www.googleapis.com/books/v1/volumes?q=javascript"
  );

  if (response.ok) {
    const payload = await response.json();
    reply.send(payload);
  } else {
    throw Error("Darn!");
  }
}
```
:::{.fragment}
This code is not modular and it is difficult to test!
:::

:::{.notes}

Applies to anything outside of the scope of our current function.
Doesn't have to be an external resouce as a public API.

This is typically what you often end up with when you just start coding without thinking about testing.

:::

## Divide the problem

```{.javascript}
handler: async (_, reply) => {
  const response = await httpClient(   // <-- Wrapper around fetch
    "https://www.googleapis.com/books/v1/volumes?q=javascript"
  );

  if (response.ok) {
    reply.send(response.books);
  } else {
    throw Error("Oh no!");
  }
}
```
Push away the complexity

## Testing becomes easy - conquer!

```{.javascript}
const fakeHttpClient = async () => ({
  ok: true,
  books: [
    {
      id: "some-book-id",
      title: "some-book-title",
      authors: ["Alice", "Bob"],
    },
  ],
});

bookRoutes({ httpClient: fakeHttpClient }).forEach((route) =>
  app.route(route)
);
```

```{.javascript}
it("should list books return by http fetch", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/books",
  });

  assert.deepEqual(response.json(), [
    {
      id: "some-book-id",
      title: "some-book-title",
      authors: ["Alice", "Bob"],
    },
  ]);
});

```

## What just happend?

:::{.fragment}
- The code became testable
- The code became modular
- No need for mocking frameworks
:::

# Always return something useful

:::{.incremental}
- Will make testing _a lot_ cleaner 
- Promotes declarative (functional) style
- Will make reasoning about code easier
:::

## The problem with void functions

:::{.invisible}
:::

```{.javascript} 
async function updatePhoneNumber(contactId, phoneNumber, context) {
  const { contanctsRepository } = context;
  const contact = await contanctsRepository
    .getById(contactId)
    .then((contact) => ({ ...contact, phoneNumber }));
  contanctsRepository.save(contact); // This line is problematic!
}
```

```{.javascript}
describe("update phone number", () => {
  const initalContact = {
    id: 1,
    name: "Alice",
    phoneNumber: "123123123",
  };
  let hasSavedUser = false;
  const fakeRepo = {
    getById: async (id) => initalContact,
    save: async (contact) => {
      hasSavedUser = true;
    },
  };
  it("should call function to update phone number", async () => {
    await updatePhoneNumber(1, "987987987", {
      contanctsRepository: fakeRepo,
    });
    assert.ok(hasSavedUser); // Test has tight coupling to implementation.
  });
});
```

:::{.notes}
- Messy to test multiple times - requires resetting the variable or using a
counter, which is problematic in asyncrounous testing.
- Could be more difficult to refactor without fundamentally changing the test.
:::

## Return something useful

```{.javascript}
async function updatePhoneNumber(contactId, phoneNumber, context) {
  const { contanctsRepository } = context;
  const contact = await contanctsRepository
    .getById(contactId)
    .then((contact) => ({ ...contact, phoneNumber }));
  return contanctsRepository.save(contact); // Magic!
}
```

```{.javascript}
describe("update phone number", () => {
  it("should update phone number on contact", async () => {
    const initalContact = {
      id: 1,
      name: "Alice",
      phoneNumber: "123123123",
    };
    const fakeRepo = {
      getById: async (id) => initalContact,
      save: async (contact) => contact,
    };
    const newNumber = "987987987";
    const updatedContact = await updatePhoneNumber(1, newNumber, {
      contanctsRepository: fakeRepo,
    });
    assert.equal(newNumber, updatedContact.phoneNumber);
  });
});

```

:::{.notes}

This code will

- be easier to read and understand (**less cognitive load**)
- be easier to refactor (no test specific implementation) 

:::

## Test coverage

70% - 80% is often recomended.

:::{.fragment .fade-right}

_This is usually too much in a typical modern code base!_

:::

::: notes

Modern code is usually using frameworks with lots of boilerplate code.

Database heavy code (built against a relational model) is difficult to develop with TDD style.

:::

# Demo

We will look at a small server side application that collects Javascript books
from a public API and manages a shopping cart for those books.


:::{.notes}
- testing against external resources
- testing the API layer
- testing the database layer
- two different mocking strategies 
- how to create an efficient workflow
- how to split tests for the CI/CD pipelines
:::

---
<div style="font-family: var(--r-heading-font); font-size: 4em; text-shadow: 0px 0px 80px #4889bf;">
Thank You!
</div>

[https://github.com/seenthis-ab/hands_on_tdd_in_javascript](https://github.com/seenthis-ab/hands_on_tdd_in_javascript)

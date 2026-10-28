describe("Gerenciamento de usuários", () => {
  it("Dado que existem usuários cadastrados, quando eu consultar /users, então devem ser retornados 10 usuários com os campos obrigatórios", () => {
    cy.request("/users").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array").and.have.length(10);
      expect(res.body[0]).to.have.all.keys(
        "id", "name", "username", "email", "address", "phone", "website", "company",
      );
    });
  });

  it("Dado que o usuário 1 existe, quando eu consultar /users/1, então devem ser retornados o usuário e seus campos obrigatórios", () => {
    cy.request("/users/1").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(1);
      expect(res.body).to.have.all.keys(
        "id", "name", "username", "email", "address", "phone", "website", "company",
      );
    });
  });

  it("Dado que eu tenho os dados de um novo usuário, quando eu enviar um POST para /users, então o usuário deve ser criado com id 11", () => {
    const novoUsuario = {
      name: "Usuário de teste",
      username: "usuario_teste",
      email: "teste@exemplo.com",
    };

    cy.request("POST", "/users", novoUsuario).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.include(novoUsuario);
      expect(res.body.id).to.eq(11);
    });
  });

  it("Dado que eu tenho os dados completos do usuário 1, quando eu enviar um PUT para /users/1, então o usuário deve ser substituído", () => {
    const usuarioAtualizado = {
      id: 1,
      name: "Usuário atualizado",
      username: "usuario_atualizado",
      email: "atualizado@exemplo.com",
      address: {
        street: "Rua de Teste",
        suite: "Apto. 1",
        city: "São Paulo",
        zipcode: "01000-000",
        geo: { lat: "-23.5505", lng: "-46.6333" },
      },
      phone: "11 99999-9999",
      website: "exemplo.com",
      company: {
        name: "Empresa de Teste",
        catchPhrase: "Qualidade de software",
        bs: "automação de testes",
      },
    };

    cy.request("PUT", "/users/1", usuarioAtualizado).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal(usuarioAtualizado);
    });
  });

  it("Dado que o usuário 1 existe, quando eu enviar um DELETE para /users/1, então deve ser retornado status 200 com corpo vazio", () => {
    cy.request("DELETE", "/users/1").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal({});
    });
  });
});

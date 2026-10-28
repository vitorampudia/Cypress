describe("Gerenciamento de posts", () => {
  it("Dado que existem posts cadastrados, quando eu consultar /posts, então devem ser retornados 100 posts com os campos obrigatórios", () => {
    cy.request("/posts").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array").and.have.length(100);
      expect(res.body[0]).to.have.all.keys("userId", "id", "title", "body");
    });
  });

  it("Dado um novo post, quando eu enviar um POST, então ele deve ser criado", () => {
    const novoPost = { title: "Meu post", body: "Teste", userId: 1 };

    cy.request("POST", "/posts", novoPost).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.include(novoPost);
      expect(res.body.id).to.eq(101);
    });
  });

  it("Dado que eu tenho os dados de um novo post, quando eu enviar um POST para /posts, então o post deve ser criado com id 101", () => {
    const novoPost = {
      title: "Meu post de teste",
      body: "Conteúdo criado via BDD",
      userId: 1,
    };

    cy.request("POST", "/posts", novoPost).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.include(novoPost);
      expect(res.body.id).to.eq(101);
    });
  });

  it("Dado que eu tenho os dados completos do post 1, quando eu enviar um PUT para /posts/1, então o post deve ser substituído", () => {
    const postAtualizado = {
      id: 1,
      title: "Título atualizado",
      body: "Corpo atualizado",
      userId: 1,
    };

    cy.request("PUT", "/posts/1", postAtualizado).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal(postAtualizado);
    });
  });

  it("Dado que o post 1 existe, quando eu enviar um DELETE para /posts/1, então deve ser retornado status 200 com corpo vazio", () => {
    cy.request("DELETE", "/posts/1").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal({});
    });
  });

  it("Dado que o ID zero não identifica um post, quando eu consultar /posts/0, então deve retornar status 404", () => {
    cy.request({
      url: "/posts/0",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.deep.equal({});
    });
  });

  it("Dado um ID com letras, quando eu consultar /posts/abc, então deve retornar status 404", () => {
    cy.request({
      url: "/posts/abc",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.deep.equal({});
    });
  });

  it("Dado que o post 9999 não existe, quando eu enviar um DELETE para /posts/9999, então a API deve retornar status 200 com corpo vazio", () => {
    // A JSONPlaceholder simula a exclusão mesmo para IDs inexistentes.
    cy.request("DELETE", "/posts/9999").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal({});
    });
  });

  it("Dado um ID inválido, quando eu enviar um PUT para /posts/abc, então a API deve retornar status 500", () => {
    const postAtualizado = {
      title: "Título atualizado",
      body: "Corpo atualizado",
      userId: 1,
    };

    // A JSONPlaceholder retorna 500 ao atualizar um ID inválido.
    cy.request({
      method: "PUT",
      url: "/posts/abc",
      body: postAtualizado,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(500);
      expect(res.headers["content-type"]).to.include("text/html");
      expect(res.body).to.be.a("string").and.not.be.empty;
    });
  });

  it("Dado que o usuário 1 possui posts, quando eu filtrar /posts por userId=1, então devem ser retornados apenas os seus 10 posts", () => {
    cy.request({
      url: "/posts",
      qs: { userId: 1 },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array").and.have.length(10);
      res.body.forEach((post) => {
        expect(post.userId).to.eq(1);
      });
    });
  });

  it("Dado que o post 1 existe, quando eu consultar /posts/1, então devem ser retornados o post e seus campos obrigatórios", () => {
    cy.request("/posts/1").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.all.keys("userId", "id", "title", "body");
      expect(res.body.id).to.eq(1);
    });
  });

  it("Dado que o post 9999 não existe, quando eu consultar /posts/9999, então deve retornar status 404", () => {
    cy.request({
      url: "/posts/9999",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.deep.equal({});
    });
  });

  it("Dado que o post 1 existe, quando eu alterar somente seu título com PATCH, então os demais campos devem ser preservados", () => {
    const alteracao = { title: "Título alterado parcialmente" };

    cy.request("/posts/1").then((resOriginal) => {
      expect(resOriginal.status).to.eq(200);

      cy.request("PATCH", "/posts/1", alteracao).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.equal({
          ...resOriginal.body,
          ...alteracao,
        });
      });
    });
  });

  it("Dado que o usuário 1 possui posts, quando eu filtrar por userId=1 com _limit=5, então devem ser retornados 5 posts desse usuário", () => {
    cy.request({
      url: "/posts",
      qs: { userId: 1, _limit: 5 },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array").and.have.length(5);
      res.body.forEach((post) => {
        expect(post.userId).to.eq(1);
      });
    });
  });

  it("Dado um corpo vazio, quando eu enviar um POST para /posts, então a API deve retornar status 201 contendo apenas o id 101", () => {
    cy.request("POST", "/posts", {}).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.deep.equal({ id: 101 });
    });
  });
});

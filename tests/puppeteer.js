const puppeteer = require("puppeteer");
require("../app");
const { factory, seed_db, testUserPassword } = require("../utils/seed_db");
const Item = require("../models/Item");
const User = require("../models/User");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("victor-lamedarojas-lion puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page logon link", async () => {
      this.logonLink = await page.waitForSelector("a ::-p-text(Logon)");
    });
    it("gets to the logon page", async () => {
      await this.logonLink.click();
      await page.waitForNavigation();
      const email = await page.waitForSelector('input[name="email"]');
    });
  });
  describe("logon page test", function () {
    this.timeout(60000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });
    it("sends the logon", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.submit.click();
      await page.waitForNavigation();
      await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
      await page.waitForSelector("a ::-p-text(Inventory page)");
      await page.waitForSelector('a[href="/items"]');
      const copyr = await page.waitForSelector(
        "p ::-p-text(Victor Manuel Lameda Rojas. All rights reserved.)",
      );
      const copyrText = await copyr.evaluate((el) => el.textContent);
    });
  });
  describe("puppeteer job operations", function () {
    it("should click the link to the inventory", async () => {
      this.inventoryLink = await page.waitForSelector(
        "button ::-p-text(Inventory page)",
      );
      await this.inventoryLink.click();
      await page.waitForNavigation();
    });
    it("should click the add an inventory item button", async () => {
      const { expect } = await import("chai");

      this.addItemPageButton = await page.waitForSelector('a[href="/items/new');
      await this.addItemPageButton.click();
      await page.waitForNavigation();
      this.addItemForm = await page.waitForSelector("#addItemForm");
      expect(this.addItemForm).to.not.be.null;

      this.name = await page.waitForSelector("#name");
      this.description = await page.waitForSelector("#description");
      this.quantity = await page.waitForSelector("#quantity");
      this.category = await page.waitForSelector("#category");
    });
    it("should type some values into the form fields then add item", async () => {
      const { expect } = await import("chai");

      this.item = await factory.build("item");

      await this.name.type(this.item.name);
      await this.description.type(this.item.description);
      await this.quantity.type(String(this.item.quantity));
      await this.category.select(this.item.category);

      //click add button
      this.timeout(60000);
      this.addItemButton = await page.waitForSelector("button ::-p-text(add)");
      this.addItemButton.click();
      await page.waitForNavigation();

      this.message = await page.waitForSelector("div ::-p-text(Info:)");
      const content = await page.$eval(
        "div ::-p-text(Info:)",
        (element) => element.textContent,
      );
      expect(content).to.include("Item successfully added to database.");

      const latestItem = await Item.findOne({
        name: this.item.name,
        description: this.item.description,
        quantity: this.item.quantity,
        category: this.item.category,
      });
      expect(latestItem).to.have.property("name");
      expect(latestItem).to.have.property("description");
      expect(latestItem).to.have.property("quantity");
      expect(latestItem).to.have.property("category");
    });
  });
});

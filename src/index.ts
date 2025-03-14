#!/usr/bin/env node
import fs from "node:fs/promises";
import fsNorm from "node:fs";
import path from "path";
import readline from "readline";

type packageJson = {
  name: string;
  version: string;
  main: string;
};

let homeDir = process.argv[1].split("/").slice(0, -2).join("/");
let packageData: packageJson;

packageData = JSON.parse(
  await fs.readFile(path.join(homeDir, "package.json"), "utf-8")
);
console.clear();
console.log("Welcome to", packageData.name);
console.log("App Version :", packageData.version);

let playlistPath = path.join(homeDir, "playlist.json");

if (!fsNorm.existsSync(playlistPath)) {
  await fs.writeFile(
    playlistPath,
    JSON.stringify({ music_folder: "./music", songs: [] })
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function loadPlayList() {
  let music_data = JSON.parse(
    (await fs.readFile(path.join(homeDir, "playlist.json"))).toString()
  );
  return music_data.songs;
}
let songs = await loadPlayList();
console.log("Songs are :", songs);
process.exit();

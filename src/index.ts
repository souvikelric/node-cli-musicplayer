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
// let songs = await loadPlayList();
// console.log("Songs are :", songs);

function addSong(name: string, url: string) {
  console.log(name, url);
}

async function listSongs() {
  let songs = await loadPlayList();
  console.log(songs);
}

function downloadAudio(name: string, url: string) {
  console.log("downloading");
}

function playAudio(name: string) {
  console.log("playing");
}

rl.question("Enter command (add, list, download, play, exit): ", (command) => {
  switch (command) {
    case "add":
      rl.question("Song name: ", (name) => {
        rl.question("YouTube link: ", (url) => {
          addSong(name, url);
          rl.close();
        });
      });
      break;
    case "list":
      listSongs();
      rl.close();
      break;
    case "download":
      rl.question("Song name: ", (name) => {
        rl.question("YouTube link: ", (url) => {
          downloadAudio(name, url);
          rl.close();
        });
      });
      break;
    case "play":
      rl.question("Enter song name to play: ", (name) => {
        playAudio(name);
        rl.close();
      });
      break;
    case "exit":
      rl.close();
      break;
    default:
      console.log("Unknown command.");
      rl.close();
  }
});

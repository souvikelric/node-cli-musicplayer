#!/usr/bin/env node
import fs from "node:fs/promises";
import fsNorm from "node:fs";
import path from "path";
import readline from "readline";
import { Downloader } from "ytdl-mp3";
let homeDir = process.argv[1].split("/").slice(0, -2).join("/");
let packageData;
packageData = JSON.parse(await fs.readFile(path.join(homeDir, "package.json"), "utf-8"));
console.clear();
console.log("Welcome to", packageData.name);
console.log("App Version :", packageData.version);
let playlistPath = path.join(homeDir, "playlist.json");
if (!fsNorm.existsSync(playlistPath)) {
    await fs.writeFile(playlistPath, JSON.stringify({ music_folder: "./music", songs: [] }));
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
async function loadPlayList() {
    let music_data = JSON.parse((await fs.readFile(path.join(homeDir, "playlist.json"))).toString());
    return music_data.songs;
}
async function savePlayList(name, fileUrl) {
    let oldSongs = await loadPlayList();
    oldSongs.push({ name: name, url: fileUrl });
    console.log(`Song ${name} added at path ${fileUrl}`);
}
async function addSong(name, url) {
    // check if music folder exists
    let musicFolderExists = fsNorm.existsSync(path.resolve(homeDir, "music"));
    if (!musicFolderExists) {
        await fs.mkdir(path.join(homeDir, "music"));
    }
    downloadAudio(name, url);
    //savePlayList(name, newPath);
}
async function listSongs() {
    let songs = await loadPlayList();
    console.log(songs);
}
function downloadAudio(name, url) {
    const filePath = path.join(homeDir, "music");
    const downloader = new Downloader({ getTags: true, outputDir: filePath });
    downloader
        .downloadSong(url)
        .then((data) => console.log(data))
        .catch((err) => console.log("failed to download"));
    // output
    //   .then((data) => console.log(data.outputFile, data.artist))
    //   .catch((err) => console.log(err));
}
function playAudio(name) {
    console.log("playing");
}
rl.question("Enter command (add, list, play, exit): ", (command) => {
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

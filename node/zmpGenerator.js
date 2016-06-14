const fs = require('fs'),
      path = require('path');

const guid = require('guid'),
      translit = require('translit')(require("translit-russian")),
      rmdir = require('rimraf');

const options = require('./options.json');

let setOptions = function(foldersMaps, folderSasMaps, filesExts, serverURI){
    return;
}

// Get all sqlite files in list
let getAllFiles = function(folders, exts){
    let files = [];
    folders.forEach(function(folder){
        let allFiles = fs.readdirSync(folder);
        let filteredFiles = [];
        exts.forEach(function(ext){
            filteredFiles.push(...allFiles.filter(file => file.endsWith(ext)))
        })
        files.push(...filteredFiles.map(file => path.join(folder, file)))
    })
    return files
}

// Create ZMP folders
let generateZMPFolders = function(files, folderSasMaps, serverURI, serverPort){
    files.forEach(function(file){
        let params = {};
        params.name = path.basename(file);
        params.nameFormat = translit(params.name).replace(/(\s+|\.)/g, "_");
        params.nameEncode = encodeURI(file);
        params.pnum = Math.floor(Math.random() * 9000 + 1000);
        params.guid = guid.raw();

        let OutputParams = `[PARAMS]\npnum=${params.pnum}\nGUID={${params.guid}}\nname=${params.nameFormat}\nNameInCache=${params.nameFormat}\nDefURLBase=${serverURI}:${serverPort}/${params.nameEncode}\nContentType=image/png\nExt=.png\nprojection=1\nsradiusa=6378137\nsradiusb=6378137\nseparator=1\nUseDwn=1\nSleep=0\nDefHotKey=0\nPARENTSUBMENU=!\nRequestHead=User-Agent: SAS.Planet\nIteratorSubRectSize=8,8`
        var GetUrlScript = `begin\n     ResultURL:=GetURLBase+'/'+inttostr(18-GetZ)+'/'+inttostr(GetX)+'/'+inttostr(GetY);\nend.`;

        // Remove previous version
        let exportPath = path.join(folderSasMaps, params.nameFormat + ".zmp");
        rmdir(exportPath, function(error){
            fs.mkdirSync(exportPath);
            fs.writeFileSync(path.join(exportPath, "params.txt"), OutputParams);
            fs.writeFileSync(path.join(exportPath, "GetUrlScript.txt"), GetUrlScript);
        });

    })
}

let files = getAllFiles(options.foldersMaps, options.filesExts);
generateZMPFolders(files, options.folderSasMaps, options.serverURI, options.serverPort)

import './vendor'
let engineerList = []
let excludeFile = [/*'chunk-vue-vendors'*/]

let loadIncludeFolders = () => {
    var folders = {}
    var folder  = require.context('./', true, /\/([\s\S]*(\.js|\.css))/)
    folder.keys().forEach(key => {
        key = key.replace(/\.\//g,'')
        key = key.substring(0, key.indexOf('/'))
        if (!folders[key]) {
            folders[key] = 1
        }
    })
    var folderKeys = folder.keys();
    Object.keys(folders).forEach(key => {
        loadFoldersJsAndCss(key, folderKeys, folder)
    })
}

let loadFoldersJsAndCss = (filename, folderKeys, folder) => {
    var jsfiles = folderKeys.filter(key => {
        return key.match(`./${filename}/js/`) && key.match(/\.js/g) && excludeFile.reduce((total,current) => {
            return total && !key.match(current)
        },true)
    })
    var cssfiles = folderKeys.filter(key => {
        return key.match(`./${filename}/css/`)
    })
    jsfiles.forEach(key => {
        import(`${key}`)
        if (folder(key) && folder(key).vueInstance) {
            engineerList.push({
                name: filename,
                vueInstance: folder(key).vueInstance
            })
        }
    })
    cssfiles.forEach(key => {
        import(`${key}`)
    })
}

loadIncludeFolders()
console.log(engineerList)
export let getInstance = (name) => {
    var target = engineerList.find(item => item.name == name)
    return target ? target : null
}

export let mount = (instance, id = 'app', appendToTarget = document.body) => {
    var container  = document.createElement('div');
    container.className = `${instance.name}` 
    var target  = document.createElement('div');
    target.id = id
    container.append(target);
    appendToTarget.append(container);
    if (instance) {
        instance.vueInstance.$mount(`.${instance.name} #${id}`)
    }
    return target
}




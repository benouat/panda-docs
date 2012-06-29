function getHashedHeaders(content) {
    var lines = content.split(/\n|\r\n|\r/);
    return lines.map(function(line, index, lines) {
        var match = /^(\#{1,8})\s+(.+)$/.exec(line);
            
        return match ?  { 
            rank: match[1].length,
            name: match[2],
            line: index,
            link: linkify(match[2])
            } : null;
    })
    .filter(function(x) { return x != null; });
}

function getUnderlinedHeaders(content) {
    var lines = content.split(/\n|\r\n|\r/);
    return lines.map(function(line, index, lines) {
        if (index === 0) return null;
        var rank;
                
        if (/^==+/.exec(line)) {
            rank = 1;
        } else if (/^--+/.exec(line)) {
            rank = 2;
        } else {
            return null;
        }

        return {
            rank:  rank,
            name:  lines[index - 1],
            line:  index - 1
        };
    })
    .filter(function(x) { return x != null; });
}

function linkify(text) {
    return "#" +
        text
        .toLowerCase()
        .trim()
        .replace(/ /g,'-')
        .replace(/[`.,()*]/g,'');
}

module.exports = {
    generate: function(input) {
        return getUnderlinedHeaders(input).concat(getHashedHeaders(input));
    },
    
    autoLinkifyHeaders: function(content) {
        return content.replace(/<h([1-6])>(.+?)<\/h[1-6]>/igm, function(match, type, text) {
            var link = linkify(text);
            return "<h" + type + "><a name='"+link.substr(1)+"' class='anchor' href='"+link+"'></a>"+text+"</h" + type + ">";
        });
    }
};
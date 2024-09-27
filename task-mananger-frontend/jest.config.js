module.exports = {
  // ... other Jest configurations ...
  "transform": {
    "^.+\\.(js|jsx)$": "babel-jest" 
  },
  // Transform axios (and potentially other problem modules)
  transformIgnorePatterns: [
    '/node_modules/(?!axios)' 
  ],
};
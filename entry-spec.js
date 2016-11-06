const context = require.context('./src', true, /\.spec.ts(|x)$/);

context.keys().forEach(context);

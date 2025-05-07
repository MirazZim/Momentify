export default defineConfig({
	plugins: [react()],
	server: process.env.NODE_ENV === 'development' ? {
	  port: 3000,
	  proxy: {
		"/api": {
		  target: "http://localhost:5000",
		  changeOrigin: true,
		  secure: false,
		},
	  },
	} : undefined,
	build: {
	  outDir: '../backend/public', // Important for deployment
	  emptyOutDir: true,
	}
  })
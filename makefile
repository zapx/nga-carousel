gitpush:
	@git add .
	@git commit -m "$m"
	@git push -u origin master
publish:
	@npm run build
	@npm login
	@npm publish --access public
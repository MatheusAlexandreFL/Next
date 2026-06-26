export const getImageUrl = (path) => {
  if (!path) return '';
  // Se a imagem já for uma URL completa (ex: testes antigos ou links da web), retorna ela mesma
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Caso contrário, concatena com a URL do backend
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
};

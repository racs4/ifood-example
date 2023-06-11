export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret',
};

export enum Services {
  ORDER = 'ORDER_SERVICE',
  AUTH = 'AUTH_SERVICE',
  CLIENT = 'CLIENT_SERVICE',
}

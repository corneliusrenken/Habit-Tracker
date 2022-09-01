/* eslint-disable import/prefer-default-export */
import prisma from '..';

// temporary user before oAuth
export function addUser() {
  return prisma.user.create({
    data: true,
    select: {
      id: true,
    },
  });
}

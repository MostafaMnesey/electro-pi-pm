import { mainRoles } from "../../Utils/Enums/roles.js";
import { errorResponse } from "../../Utils/Response.js";
import { MESSAGES } from "../../Constants/messages.constants.js";
import { redis } from "../../Utils/Radis/Connection.js";
import * as db from "../../database/dbService.js";

export const createProjectService = async (req) => {
  const { user } = req;
  const { name, description, members } = req.body;
  const projectSlug = name.toLowerCase().replace(/\s+/g, "-");
  const projectExist = await db.findOne({
    model: "Project",
    where: {
      slug: projectSlug,
    },
  });
  if (projectExist) {
    errorResponse({
      message: MESSAGES.PROJECT_ALREADY_EXISTS,
      status: 400,
    });
  }

  const membersCheck = await db.findMany({
    model: "user",
    where: {
      id: {
        in: members,
      },
    },
  });

  const memberIds = [...new Set(membersCheck.map((m) => m.id))];

  if (!memberIds.includes(user.id)) {
    memberIds.push(user.id);
  }

  const project = await db.create({
    model: "Project",
    data: {
      name,
      slug: projectSlug,
      description,
      ownerId: user.id,
      members: members
        ? {
            create: memberIds?.map((member) => ({
              user: { connect: { id: member } },
            })),
          }
        : undefined,
    },
  });
  return project;
};

export const getAllProjectsService = async (req) => {
  const { page = 1, limit = 10, search } = req.query;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await db.findManyWithPaginationAndCount({
    model: "Project",
    page,
    limit,
    where,
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      createdAt: true,

      owner: {
        select: {
          id: true,
          name: true,
        },
      },

      members: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,

          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return users;
};

export const getProjectBySlugService = async (req) => {
  const slug = req.params.slug;

  const targetProject = await db.findOne({
    model: "Project",
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      createdAt: true,

      owner: {
        select: {
          id: true,
          name: true,
        },
      },

      members: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,

          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!targetProject) {
    errorResponse({
      message: MESSAGES.PROJECT_NOT_FOUND,
      status: 404,
    });
  }

  return targetProject;
};

export const getMyProjectsService = async (req) => {
  const { user } = req;

  const { page = 1, limit = 10, search } = req.query;
  const where = {};

  const projects = await db.findManyWithPaginationAndCount({
    model: "ProjectMember",
    page,
    limit,
    orderBy: { joinedAt: "desc" },
    where: {
      userId: user.id,
      ...where,
    },
    select: {
      project: {
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          createdAt: true,

          owner: {
            select: {
              id: true,
              name: true,
            },
          },

          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },

          tasks: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              priority: true,
              dueDate: true,
              createdAt: true,
              updatedAt: true,

              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },

              assignee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return projects;
};

export const updateProjectService = async (req) => {
  const { id } = req.params;
  const { name, description, members } = req.body;
  const project = await db.findOne({
    model: "Project",
    where: { id },
  });
  if (!project) {
    errorResponse({
      message: MESSAGES.PROJECT_NOT_FOUND,
      status: 404,
    });
  }
  const projectSlug = name
    ? name.toLowerCase().replace(/\s+/g, "-")
    : project.slug;
  if (name) {
    const projectExist = await db.findOne({
      model: "Project",
      where: {
        slug: projectSlug,
      },
    });
    if (projectExist) {
      errorResponse({
        message: MESSAGES.PROJECT_ALREADY_EXISTS,
        status: 400,
      });
    }
  }
  const updatedProject = await db.updateOne({
    model: "Project",
    where: { id },
    data: {
      name,
      slug: projectSlug,
      description,
    },
  });
  return updatedProject;
};

export const deleteProjectService = async (req) => {
  const { id } = req.params;

  const project = await db.findOne({
    model: "Project",
    where: { id },
  });

  if (!project) {
    errorResponse({
      message: MESSAGES.PROJECT_NOT_FOUND,
      status: 404,
    });
  }

  const deletedProject = await db.deleteOne({
    model: "Project",
    where: { id },
  });

  return deletedProject;
};

export const addMembersService = async (req) => {
  const { id } = req.params;
  const { userIds } = req.body;

  const project = await db.findOne({
    model: "Project",
    where: { id },
  });

  if (!project) {
    errorResponse({
      message: MESSAGES.PROJECT_NOT_FOUND,
      status: 404,
    });
  }

  const users = await db.findMany({
    model: "user",
    where: {
      id: { in: userIds },
    },
  });
  let memberIds = [...new Set(users.map((u) => u.id))];
  if (users.length !== userIds.length) {
    const missingIds = userIds.filter((id) => !memberIds.includes(id));
    errorResponse({
      message: `Members with IDs ${missingIds.join(", ")} not found`,
      status: 404,
    });
  }

  const alreadyMembers = await db.findMany({
    model: "ProjectMember",
    where: {
      projectId: id,
      userId: { in: memberIds },
    },
  });

  if (alreadyMembers.length > 0) {
    memberIds = memberIds.filter(
      (id) => !alreadyMembers.some((m) => m.userId === id),
    );
  }

  const addedMembers = await db.createMany({
    model: "ProjectMember",
    data: memberIds?.map((userId) => ({
      projectId: id,
      userId,
    })),
  });

  return addedMembers;
};

export const removeMembersService = async (req) => {
  const { id } = req.params;
  const { userIds } = req.body;

  const project = await db.findOne({
    model: "Project",
    where: { id },
  });

  if (!project) {
    errorResponse({
      message: MESSAGES.PROJECT_NOT_FOUND,
      status: 404,
    });
  }

  const users = await db.findMany({
    model: "user",
    where: {
      id: { in: userIds },
    },
  });
  let memberIds = [...new Set(users.map((u) => u.id))];
  if (users.length !== userIds.length) {
    const missingIds = userIds.filter((id) => !memberIds.includes(id));
    errorResponse({
      message: `Members with IDs ${missingIds.join(", ")} not found`,
      status: 404,
    });
  }
  const projectMembers = await db.findMany({
    model: "ProjectMember",
    where: {
      projectId: id,
      userId: { in: memberIds },
    },
  });

  const projectMemberIds = projectMembers.map((m) => m.userId);

  const removedMembers = await db.deleteMany({
    model: "ProjectMember",
    where: {
      projectId: id,
      userId: { in: projectMemberIds },
    },
  });

  return {
    removed: removedMembers,
    skipped: memberIds.filter((id) => !projectMemberIds.includes(id)),
  };
};

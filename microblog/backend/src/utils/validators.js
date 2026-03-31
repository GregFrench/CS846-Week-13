import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(280).required(),
});

export const createReplySchema = Joi.object({
  content: Joi.string().min(1).max(280).required(),
});

export const validateRegister = (data) => {
  const { error, value } = registerSchema.validate(data, { abortEarly: false });
  return { error, value };
};

export const validateLogin = (data) => {
  const { error, value } = loginSchema.validate(data, { abortEarly: false });
  return { error, value };
};

export const validateCreatePost = (data) => {
  const { error, value } = createPostSchema.validate(data, { abortEarly: false });
  return { error, value };
};

export const validateCreateReply = (data) => {
  const { error, value } = createReplySchema.validate(data, { abortEarly: false });
  return { error, value };
};

export const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

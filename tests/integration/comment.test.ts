import request from 'supertest';
import express from 'express';
import nock from 'nock';
import { createApp } from '../../src/app';
import { randomUUID } from "node:crypto";

const permissionServiceHost = 'localhost';
const permissionServicePort = 3001;
const permissionServiceBaseUrl = `http://${permissionServiceHost}:${permissionServicePort}`;

describe('Comment Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp({ host: permissionServiceHost, port: permissionServicePort });
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.cleanAll();
  });

  describe('POST /comments', () => {
    it('should create a comment successfully', async () => {
      const userId = 'user-123';
      const commentData = {
        projectId: 'project-1',
        taskId: 'task-1',
        text: 'This is a test comment'
      };

      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'COMMENT',
          action: 'CREATE'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .post('/comments')
        .set('identity-user-id', userId)
        .send(commentData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        userId,
        projectId: commentData.projectId,
        taskId: commentData.taskId,
        text: commentData.text
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('should return 401 when user ID is missing', async () => {
      const commentData = {
        projectId: 'project-1',
        taskId: 'task-1',
        text: 'This is a test comment'
      };

      const response = await request(app)
        .post('/comments')
        .send(commentData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'User ID required' });
    });

    it('should return 403 when user lacks permission', async () => {
      const userId = 'user-123';
      const commentData = {
        projectId: 'project-1',
        taskId: 'task-1',
        text: 'This is a test comment'
      };

      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'COMMENT',
          action: 'CREATE'
        })
        .reply(200, { allowed: false });

      const response = await request(app)
        .post('/comments')
        .set('identity-user-id', userId)
        .send(commentData);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Access denied' });
    });
  });

  describe('GET /comments', () => {
    it('should retrieve comments successfully', async () => {
      const userId = "user-" + randomUUID();
      const projectId = 'project-' + randomUUID();
      const taskId = 'task-1';

      // First create a comment
      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'COMMENT',
          action: 'CREATE'
        })
        .reply(200, { allowed: true });

      await request(app)
        .post('/comments')
        .set('identity-user-id', userId)
        .send({
          projectId,
          taskId,
          text: 'Test comment'
        });

      // Then retrieve comments
      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'COMMENT',
          action: 'LIST'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .get('/comments')
        .set('identity-user-id', userId)
        .query({ projectId, taskId });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        userId,
        projectId,
        taskId,
        text: 'Test comment'
      });
    });

    it('should return 401 when user ID is missing', async () => {
      const response = await request(app)
        .get('/comments')
        .query({ projectId: 'project-1', taskId: 'task-1' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'User ID required' });
    });

    it('should return 403 when user lacks permission', async () => {
      const userId = 'user-123';

      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'COMMENT',
          action: 'LIST'
        })
        .reply(200, { allowed: false });

      const response = await request(app)
        .get('/comments')
        .set('identity-user-id', userId)
        .query({ projectId: 'project-1', taskId: 'task-1' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Access denied' });
    });

    it('should return empty array when no comments exist', async () => {
      const userId = 'user-456';
      const projectId = 'project-2';
      const taskId = 'task-2';

      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'COMMENT',
          action: 'LIST'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .get('/comments')
        .set('identity-user-id', userId)
        .query({ projectId, taskId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});

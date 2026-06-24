import { expect } from 'chai';

import * as fs from 'fs';
const actualResults: Record<string, string> = {};
let lastResponse: any;

import { apiClient } from '../utils/api.client';
import { createValidUserPayload, updateValidUserPayload, edgeCasePayloads } from '../data/user.payload';

describe('Users API E2E Testing (reqres.in)', () => {
  // Let's store the created user ID although the mock API doesn't persist it.
  // This is a common practice in E2E testing.
  let createdUserId: string | number;


  afterEach(function() {
    if (this.currentTest && lastResponse) {
      const dataStr = JSON.stringify(lastResponse.body);
      const truncated = dataStr && dataStr.length > 50 ? dataStr.substring(0, 50) + '...' : dataStr;
      actualResults[this.currentTest.title] = `Status ${lastResponse.status}<br/>${truncated || ''}`;
    }
    lastResponse = null;
  });

  after(function() {
    fs.writeFileSync('actual-results.json', JSON.stringify(actualResults));
  });

  describe('1. Create a new User (POST /api/users)', () => {
    it('Positive: Should create a new user successfully', async () => {
      lastResponse = await apiClient.post('/api/users', createValidUserPayload);
      const response = lastResponse;
      
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('name', createValidUserPayload.name);
      expect(response.body).to.have.property('job', createValidUserPayload.job);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
      
      createdUserId = response.body.id;
    });

    it('Negative: Should handle missing body gracefully', async () => {
      lastResponse = await apiClient.post('/api/users', {});
      const response = lastResponse;
      
      // Reqres still returns 201 for an empty body, but it only assigns an id and createdAt.
      expect(response.status).to.equal(201);
      expect(response.body).to.not.have.property('name');
      expect(response.body).to.not.have.property('job');
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });

    it('Edge: Should accept XSS payload but treat it as literal string (No sanitization in mock)', async () => {
      lastResponse = await apiClient.post('/api/users', edgeCasePayloads.xssPayload);
      const response = lastResponse;
      
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('name', edgeCasePayloads.xssPayload.name);
    });

    it('Edge: Should handle incorrect data types (e.g., number and boolean instead of string)', async () => {
      lastResponse = await apiClient.post('/api/users', edgeCasePayloads.invalidTypePayload);
      const response = lastResponse;
      
      expect(response.status).to.equal(201);
      // Since it's a mock API, it might just accept and return the same types.
      // In a real API, this should ideally return a 400 Bad Request.
      expect(response.body).to.have.property('name', edgeCasePayloads.invalidTypePayload.name);
      expect(response.body).to.have.property('job', edgeCasePayloads.invalidTypePayload.job);
    });
  });

  describe('2. Get All User Paged (GET /api/users?page=2)', () => {
    it('Positive: Should return users for page 2', async () => {
      lastResponse = await apiClient.get('/api/users?page=2');
      const response = lastResponse;
      
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('page', 2);
      expect(response.body).to.have.property('per_page');
      expect(response.body).to.have.property('total');
      expect(response.body).to.have.property('total_pages');
      
      const data = response.body.data;
      expect(data).to.be.an('array');
      expect(data.length).to.be.greaterThan(0);
      
      // Assert schema of the first user in the array
      const firstUser = data[0];
      expect(firstUser).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
    });

    it('Negative: Should return empty data for an out of bounds page', async () => {
      lastResponse = await apiClient.get('/api/users?page=1000');
      const response = lastResponse;
      
      expect(response.status).to.equal(200);
      expect(response.body.page).to.equal(1000);
      // The array should be empty
      expect(response.body.data).to.be.an('array').that.is.empty;
    });

    it('Edge: Should handle string provided as page query parameter', async () => {
      lastResponse = await apiClient.get('/api/users?page=dua');
      const response = lastResponse;
      
      expect(response.status).to.equal(200);
      // Usually defaults back to page 1 or returns empty data if it fails parsing gracefully
      expect(response.body).to.have.property('page');
    });
  });

  describe('3. Update User (PUT /api/users/2)', () => {
    it('Positive: Should update the user successfully', async () => {
      lastResponse = await apiClient.put('/api/users/2', updateValidUserPayload);
      const response = lastResponse;
      
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('name', updateValidUserPayload.name);
      expect(response.body).to.have.property('job', updateValidUserPayload.job);
      expect(response.body).to.have.property('updatedAt');
    });

    it('Negative: Should handle update with empty payload', async () => {
      lastResponse = await apiClient.put('/api/users/2', {});
      const response = lastResponse;
      
      expect(response.status).to.equal(200);
      expect(response.body).to.not.have.property('name');
      expect(response.body).to.not.have.property('job');
      expect(response.body).to.have.property('updatedAt');
    });

    it('Edge: Should handle excessively long strings in payload', async () => {
      lastResponse = await apiClient.put('/api/users/2', edgeCasePayloads.longStringPayload);
      const response = lastResponse;
      
      // Reqres mock usually accepts anything and returns 200, 
      // but in reality this might be 413 Payload Too Large or 400 Bad Request
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('name', edgeCasePayloads.longStringPayload.name);
    });
  });

  describe('4. View Detail Single User (GET /api/users/2)', () => {
    it('Positive: Should retrieve detail of single user', async () => {
      lastResponse = await apiClient.get('/api/users/2');
      const response = lastResponse;
      
      expect(response.status).to.equal(200);
      
      const data = response.body.data;
      expect(data).to.have.property('id', 2);
      expect(data).to.have.property('email');
      expect(data).to.have.property('first_name');
      expect(data).to.have.property('last_name');
      expect(data).to.have.property('avatar');
      
      const support = response.body.support;
      expect(support).to.have.property('url');
      expect(support).to.have.property('text');
    });

    it('Negative: Should return 404 for a non-existent user', async () => {
      // User ID 23 does not exist in reqres mock database
      lastResponse = await apiClient.get('/api/users/23'); 
      const response = lastResponse;
      
      expect(response.status).to.equal(404);
      expect(response.body).to.be.empty;
    });
  });

  describe('5. Delete User (DELETE /api/users/2)', () => {
    it('Positive: Should delete the user successfully', async () => {
      lastResponse = await apiClient.delete('/api/users/2');
      const response = lastResponse;
      
      // DELETE returns 204 No Content
      expect(response.status).to.equal(204);
      expect(response.body).to.be.empty;
    });

    it('Negative: Attempt to delete user with invalid ID format (string)', async () => {
      // Reqres returns 204 for virtually any DELETE request, but we still test it
      lastResponse = await apiClient.delete('/api/users/invalid_id');
      const response = lastResponse;
      
      expect(response.status).to.equal(204); 
      expect(response.body).to.be.empty;
    });
  });
});

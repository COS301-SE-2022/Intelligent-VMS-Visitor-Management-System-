import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as supertest from 'supertest';
import { AppModule } from "../../../src/app.module";
import { UserModule } from "@vms/user";

jest.setTimeout(400000)
describe('VisitorInviteService Int', () => {
    let app: NestExpressApplication;

    const apiClient = () => {
        return supertest(app.getHttpServer());
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [
            AppModule,
            MongooseModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => {return ({
                    uri: "mongodb+srv://admin:f1restorm19091@vms-cluster.vdgmq.mongodb.net/vms-test?retryWrites=true&w=majority",
                })},
                inject: [ConfigService],
            }),
            
          ],
        }).compile();

        app = moduleRef.createNestApplication<NestExpressApplication>();
        await app.listen(3001);
      });

      afterEach(async () => {
        await app.close();
      });

      it("creates an invite in the database and sends an email", async () => {
         const { body } = await supertest.agent(app.getHttpServer())
          .post('/graphql')
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicGVybWlzc2lvbiI6MCwiaWF0IjoxNjU3ODA5Mjg2LCJleHAiOjI2NTc4MTI4ODZ9.mc9dEN3QPQOCmblrHTqUNn7mSZWme_ZNTwH3qmuZixg")
          .send({
                query: `
                    mutation {
                        createInvite(
                            userEmail: "admin@mail.com"
                            visitorEmail: "skorpion19091@gmail.com"
                            visitorName: "kyle"
                            IDDocType: "RSA-ID"
                            IDNumber: "0109195283090"
                            inviteDate: "2022-09-12"
                            requiresParking: true
                            suggestion: true
                        )
                    }

                `
          })
          .expect(200);
            
          expect(body.data).toBeDefined();

          const getInviteResponse = await supertest.agent(app.getHttpServer())
          .post('/graphql')
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicGVybWlzc2lvbiI6MCwiaWF0IjoxNjU3ODA5Mjg2LCJleHAiOjI2NTc4MTI4ODZ9.mc9dEN3QPQOCmblrHTqUNn7mSZWme_ZNTwH3qmuZixg")
          .send({
                query: `
                    query {
                        getInvites {
                            userEmail
                        }
                    }
                `
          })
          .expect(200);

          expect(getInviteResponse.body.data.getInvites.length).toBeGreaterThan(0);
      });
});


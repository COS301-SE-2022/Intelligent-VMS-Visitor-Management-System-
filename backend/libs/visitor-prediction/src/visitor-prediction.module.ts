import { Module } from '@nestjs/common';
import { VisitorPredictionService } from './visitor-prediction.service';

@Module({
  providers: [VisitorPredictionService],
  exports: [VisitorPredictionService],
})
export class VisitorPredictionModule {}
